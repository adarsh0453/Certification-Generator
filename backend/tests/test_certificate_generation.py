import os
import pytest
from app.services.pdf_service import PDFService


def test_pdf_certificate_generation(client):
    """Test PDF service generates a valid file on disk."""
    cert_num, file_path = PDFService.generate_for_recipient(
        recipient_id=1,
        recipient_name="Rahul Sharma",
        course_name="Data Science",
        completion_date="2026-10-07",
    )

    assert cert_num == "CERT-000001"
    assert os.path.exists(file_path)
    assert os.path.getsize(file_path) > 0


def test_successful_bulk_certificate_generation(client):
    """Test full job background processing generates certificates for all recipients."""
    payload = {
        "course_name": "DevOps Engineering",
        "completion_date": "2026-10-07",
        "recipients": [
            {"name": "Alice Developer", "email": "alice@example.com"},
            {"name": "Bob Sysadmin", "email": "bob@example.com"}
        ]
    }
    create_res = client.post("/api/jobs", json=payload)
    job_id = create_res.json()["job_id"]

    status_res = client.get(f"/api/jobs/{job_id}")
    data = status_res.json()

    assert data["status"] == "completed"
    assert data["successful"] == 2
    for r in data["recipients"]:
        assert r["status"] == "success"
        assert r["certificate_id"] is not None
        assert r["certificate_number"].startswith("CERT-")
