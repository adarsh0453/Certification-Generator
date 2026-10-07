import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.recipient import Recipient
from app.models.certificate import Certificate
from app.services.certificate_service import CertificateService
from app.services.pdf_service import PDFService
from app.utils.validators import sanitize_filename

router = APIRouter(tags=["Certificates"])


@router.get(
    "/certificates/{certificate_id}/download",
    summary="Download generated PDF certificate by Certificate ID",
)
def download_certificate(certificate_id: int, db: Session = Depends(get_db)):
    """
    GET /api/certificates/{certificate_id}/download
    Finds certificate record by certificate ID, re-generates fresh PDF with latest design template, and returns FileResponse.
    """
    cert = CertificateService.get_by_id(db=db, certificate_id=certificate_id)
    recipient = cert.recipient if cert else None

    if not recipient:
        # Fallback: Check if certificate_id corresponds to a recipient_id
        recipient = db.query(Recipient).filter(Recipient.id == certificate_id).first()

    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )

    job = recipient.job if recipient else None

    # Always generate/re-render PDF using the RECIPIENT'S EXACT NAME stored in database
    cert_num, file_path = PDFService.generate_for_recipient(
        recipient_id=recipient.id,
        recipient_name=recipient.name,
        course_name=recipient.course_name or (job.course_name if job else "Python Programming"),
        completion_date=recipient.completion_date or (job.completion_date if job else "2026-10-07"),
    )

    # Ensure Certificate record exists in DB
    if not cert:
        cert = CertificateService.get_by_recipient_id(db=db, recipient_id=recipient.id)
        if not cert:
            cert = Certificate(
                recipient_id=recipient.id,
                certificate_number=cert_num,
                file_path=file_path,
            )
            db.add(cert)
            db.commit()

    safe_filename = sanitize_filename(f"{cert_num}_{recipient.name}.pdf")
    return FileResponse(
        path=file_path,
        filename=safe_filename,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{safe_filename}"'},
    )


@router.get(
    "/recipients/{recipient_id}/download",
    summary="Download generated PDF certificate by Recipient ID",
)
def download_recipient_certificate(recipient_id: int, db: Session = Depends(get_db)):
    """
    GET /api/recipients/{recipient_id}/download
    Directly fetches recipient by recipient_id and returns exact PDF certificate for recipient's name.
    """
    recipient = db.query(Recipient).filter(Recipient.id == recipient_id).first()
    if not recipient:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Recipient #{recipient_id} not found",
        )

    job = recipient.job

    cert_num, file_path = PDFService.generate_for_recipient(
        recipient_id=recipient.id,
        recipient_name=recipient.name,
        course_name=recipient.course_name or (job.course_name if job else "Python Programming"),
        completion_date=recipient.completion_date or (job.completion_date if job else "2026-10-07"),
    )

    safe_filename = sanitize_filename(f"{cert_num}_{recipient.name}.pdf")
    return FileResponse(
        path=file_path,
        filename=safe_filename,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{safe_filename}"'},
    )
