import logging
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File, Form, Query, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.job import JobCreate, JobCreateResponse, JobStatusResponse, JobListPaginatedResponse
from app.services.job_service import JobService, process_job_background
from app.utils.file_utils import parse_recipients_csv

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/jobs", tags=["Jobs"])


@router.post(
    "",
    response_model=JobCreateResponse,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Create a bulk certificate generation job",
    description="Validates recipient details, persists job and recipients, and starts background certificate generation.",
)
def create_job(
    job_in: JobCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """
    POST /api/jobs
    Creates job, saves recipients to DB, triggers background worker, and returns 202 Accepted.
    """
    try:
        job = JobService.create_job(db=db, job_in=job_in)

        # Trigger background processing
        background_tasks.add_task(process_job_background, job.id)

        return JobCreateResponse(
            job_id=job.id,
            status=job.status,
            total_recipients=job.total_recipients,
            message="Certificate generation job created successfully",
        )
    except ValueError as ve:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(ve))
    except Exception as e:
        logger.exception("Failed to create job")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the job: {str(e)}",
        )


@router.post(
    "/upload-csv",
    summary="Parse and validate uploaded CSV file",
    description="Validates recipient CSV file and returns parsed recipients or line-by-line validation errors.",
)
async def parse_csv_file(file: UploadFile = File(...)):
    """
    POST /api/jobs/upload-csv
    Helper endpoint for frontend CSV upload & pre-validation.
    """
    if not file.filename.endswith(".csv"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only CSV files (.csv) are allowed",
        )

    try:
        content_bytes = await file.read()
        csv_str = content_bytes.decode("utf-8-sig")

        recipients, errors = parse_recipients_csv(csv_str)

        if errors and not recipients:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"message": "CSV parsing failed", "errors": errors},
            )

        return {
            "success": True,
            "recipients_count": len(recipients),
            "recipients": recipients,
            "validation_warnings": errors,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid or corrupted CSV file: {str(e)}",
        )


@router.get(
    "",
    response_model=JobListPaginatedResponse,
    summary="List previous certificate generation jobs",
    description="Returns paginated list of all certificate generation jobs.",
)
def list_jobs(
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: Session = Depends(get_db),
):
    """
    GET /api/jobs
    Returns paginated list of jobs.
    """
    return JobService.list_jobs(db=db, page=page, page_size=page_size)


@router.get(
    "/{job_id}",
    response_model=JobStatusResponse,
    summary="Get job status and progress",
    description="Returns progress percentage, counters (total, successful, failed, pending), and detailed recipient statuses.",
)
def get_job_status(job_id: int, db: Session = Depends(get_db)):
    """
    GET /api/jobs/{job_id}
    Returns detailed job status and recipient progress.
    """
    job_details = JobService.get_job_details(db=db, job_id=job_id)
    if not job_details:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificate generation job #{job_id} not found",
        )
    return job_details
