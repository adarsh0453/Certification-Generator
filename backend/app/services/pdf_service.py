import os
import uuid
from app.config import settings
from app.templates.certificate_template import generate_pdf_certificate
from app.utils.file_utils import ensure_directory_exists


class PDFService:
    @staticmethod
    def generate_for_recipient(
        recipient_id: int,
        recipient_name: str,
        course_name: str,
        completion_date: str,
    ) -> tuple[str, str]:
        """
        Generates a certificate PDF file for a recipient.
        Returns (certificate_number, file_path).
        """
        # Unique certificate ID format: CERT-XXXXXX
        certificate_number = f"CERT-{recipient_id:06d}"

        storage_dir = ensure_directory_exists(settings.STORAGE_DIR)
        filename = f"{certificate_number}.pdf"
        file_path = os.path.join(storage_dir, filename)

        # Generate PDF using ReportLab template
        abs_path = generate_pdf_certificate(
            output_path=file_path,
            recipient_name=recipient_name,
            course_name=course_name,
            completion_date=completion_date,
            certificate_number=certificate_number,
        )

        return certificate_number, abs_path
