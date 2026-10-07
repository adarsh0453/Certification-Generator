import os
from typing import Optional
from sqlalchemy.orm import Session
from app.models.certificate import Certificate


class CertificateService:
    @staticmethod
    def get_by_id(db: Session, certificate_id: int) -> Optional[Certificate]:
        """Fetch certificate database record by certificate ID."""
        return db.query(Certificate).filter(Certificate.id == certificate_id).first()

    @staticmethod
    def get_by_recipient_id(db: Session, recipient_id: int) -> Optional[Certificate]:
        """Fetch certificate database record by recipient ID."""
        return db.query(Certificate).filter(Certificate.recipient_id == recipient_id).first()

    @staticmethod
    def verify_file_exists(file_path: str) -> bool:
        """Check if PDF file exists on storage disk."""
        return os.path.exists(file_path) and os.path.isfile(file_path)
