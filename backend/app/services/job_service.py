import logging
from datetime import datetime, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import SessionLocal
from app.models.job import Job, JobStatus
from app.models.recipient import Recipient, RecipientStatus
from app.models.certificate import Certificate
from app.schemas.job import JobCreate, JobStatusResponse, JobListItem, JobListPaginatedResponse
from app.schemas.recipient import RecipientResponse
from app.services.pdf_service import PDFService

logger = logging.getLogger(__name__)


def process_job_background(job_id: int) -> None:
    """
    Background worker function executed via FastAPI BackgroundTasks.
    Processes each recipient independently so single recipient failure
    does not abort the remaining valid recipients.
    """
    db = SessionLocal()
    try:
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            logger.error(f"Background task job #{job_id} not found in database.")
            return

        # Update Job status to processing
        job.status = JobStatus.PROCESSING.value
        job.started_at = datetime.now(timezone.utc)
        db.commit()

        recipients = db.query(Recipient).filter(Recipient.job_id == job_id).all()

        for recipient in recipients:
            recipient.status = RecipientStatus.PROCESSING.value
            db.commit()

            try:
                # Generate certificate PDF via ReportLab
                cert_number, file_path = PDFService.generate_for_recipient(
                    recipient_id=recipient.id,
                    recipient_name=recipient.name,
                    course_name=job.course_name,
                    completion_date=job.completion_date,
                )

                # Persist or update Certificate record
                cert = db.query(Certificate).filter(Certificate.recipient_id == recipient.id).first()
                if cert:
                    cert.certificate_number = cert_number
                    cert.file_path = file_path
                    cert.generated_at = datetime.now(timezone.utc)
                else:
                    certificate = Certificate(
                        recipient_id=recipient.id,
                        certificate_number=cert_number,
                        file_path=file_path,
                        generated_at=datetime.now(timezone.utc),
                    )
                    db.add(certificate)

                recipient.status = RecipientStatus.SUCCESS.value
                recipient.error_message = None
                recipient.processed_at = datetime.now(timezone.utc)
                job.successful_count += 1

            except Exception as e:
                logger.exception(f"Failed generating certificate for recipient #{recipient.id} ({recipient.email}): {e}")
                recipient.status = RecipientStatus.FAILED.value
                recipient.error_message = str(e)
                recipient.processed_at = datetime.now(timezone.utc)
                job.failed_count += 1

            db.commit()

        # Final Job Status Determination
        if job.failed_count == 0:
            job.status = JobStatus.COMPLETED.value
        elif job.successful_count > 0:
            job.status = JobStatus.COMPLETED_WITH_ERRORS.value
        else:
            job.status = JobStatus.FAILED.value

        job.completed_at = datetime.now(timezone.utc)
        db.commit()
        logger.info(f"Finished job #{job_id}. Status: {job.status}, Success: {job.successful_count}, Failed: {job.failed_count}")

    except Exception as e:
        logger.exception(f"Unhandled error in background job #{job_id}: {e}")
        try:
            job = db.query(Job).filter(Job.id == job_id).first()
            if job:
                job.status = JobStatus.FAILED.value
                job.completed_at = datetime.now(timezone.utc)
                db.commit()
        except Exception:
            pass
    finally:
        db.close()


class JobService:
    @staticmethod
    def create_job(db: Session, job_in: JobCreate) -> Job:
        """Create new job record and recipients in database."""
        job = Job(
            course_name=job_in.course_name,
            completion_date=job_in.completion_date,
            total_recipients=len(job_in.recipients),
            status=JobStatus.PENDING.value,
            successful_count=0,
            failed_count=0,
            created_at=datetime.now(timezone.utc),
        )
        db.add(job)
        db.flush()  # populate job.id

        recipients = []
        for r_in in job_in.recipients:
            recipient = Recipient(
                job_id=job.id,
                name=r_in.name,
                email=r_in.email,
                course_name=job_in.course_name,
                completion_date=job_in.completion_date,
                status=RecipientStatus.PENDING.value,
                created_at=datetime.now(timezone.utc),
            )
            recipients.append(recipient)

        db.add_all(recipients)
        db.commit()
        db.refresh(job)
        return job

    @staticmethod
    def get_job_details(db: Session, job_id: int) -> Optional[JobStatusResponse]:
        """Fetch job details with progress and recipients list."""
        job = db.query(Job).filter(Job.id == job_id).first()
        if not job:
            return None

        total = job.total_recipients
        successful = job.successful_count
        failed = job.failed_count
        processed = successful + failed
        pending = max(0, total - processed)

        progress_percentage = int((processed / total) * 100) if total > 0 else 0

        # Build recipient responses
        recipient_responses = []
        for r in job.recipients:
            cert_id = r.certificate.id if r.certificate else None
            cert_num = r.certificate.certificate_number if r.certificate else None

            r_resp = RecipientResponse(
                id=r.id,
                job_id=r.job_id,
                name=r.name,
                email=r.email,
                course_name=r.course_name,
                completion_date=r.completion_date,
                status=r.status,
                error_message=r.error_message,
                created_at=r.created_at,
                processed_at=r.processed_at,
                certificate_id=cert_id,
                certificate_number=cert_num,
            )
            recipient_responses.append(r_resp)

        return JobStatusResponse(
            job_id=job.id,
            status=job.status,
            course_name=job.course_name,
            completion_date=job.completion_date,
            total=total,
            successful=successful,
            failed=failed,
            pending=pending,
            progress_percentage=progress_percentage,
            created_at=job.created_at,
            started_at=job.started_at,
            completed_at=job.completed_at,
            recipients=recipient_responses,
        )

    @staticmethod
    def list_jobs(db: Session, page: int = 1, page_size: int = 20) -> JobListPaginatedResponse:
        """Paginated query of previous certificate generation jobs."""
        offset = (page - 1) * page_size
        total = db.query(Job).count()

        jobs = (
            db.query(Job)
            .order_by(desc(Job.created_at))
            .offset(offset)
            .limit(page_size)
            .all()
        )

        items = [
            JobListItem(
                job_id=j.id,
                course_name=j.course_name,
                completion_date=j.completion_date,
                status=j.status,
                total_recipients=j.total_recipients,
                successful_count=j.successful_count,
                failed_count=j.failed_count,
                created_at=j.created_at,
                completed_at=j.completed_at,
            )
            for j in jobs
        ]

        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 1

        return JobListPaginatedResponse(
            items=items,
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )
