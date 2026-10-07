from unittest.mock import patch
import pytest
from app.services.pdf_service import PDFService


def test_individual_failure_isolation(client):
    """
    Test that a failure for one recipient does NOT stop remaining valid recipients.
    Mocks PDF generation to raise an exception for recipient #2.
    Verifies:
      Recipient 1 -> success
      Recipient 2 -> failed
      Recipient 3 -> success
      Job Status -> completed_with_errors
    """
    payload = {
        "course_name": "Resilience Engineering",
        "completion_date": "2026-10-07",
        "recipients": [
            {"name": "Recipient One", "email": "rec1@example.com"},
            {"name": "Recipient Two", "email": "rec2@example.com"},
            {"name": "Recipient Three", "email": "rec3@example.com"},
        ]
    }

    original_generate = PDFService.generate_for_recipient

    def mock_generate(recipient_id, recipient_name, course_name, completion_date):
        # Fail specifically for the second recipient
        if recipient_name == "Recipient Two":
            raise RuntimeError("PDF rendering error simulated for Recipient Two")
        return original_generate(recipient_id, recipient_name, course_name, completion_date)

    with patch("app.services.job_service.PDFService.generate_for_recipient", side_effect=mock_generate):
        create_res = client.post("/api/jobs", json=payload)
        job_id = create_res.json()["job_id"]

    status_res = client.get(f"/api/jobs/{job_id}")
    data = status_res.json()

    assert data["status"] == "completed_with_errors"
    assert data["total"] == 3
    assert data["successful"] == 2
    assert data["failed"] == 1

    recipients_by_name = {r["name"]: r for r in data["recipients"]}

    assert recipients_by_name["Recipient One"]["status"] == "success"
    assert recipients_by_name["Recipient Two"]["status"] == "failed"
    assert "PDF rendering error" in recipients_by_name["Recipient Two"]["error_message"]
    assert recipients_by_name["Recipient Three"]["status"] == "success"
