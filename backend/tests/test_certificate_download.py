import pytest
from app.services.job_service import process_job_background


def test_certificate_download_success(client):
    """Test downloading a valid generated PDF certificate."""
    payload = {
        "course_name": "Web Security",
        "completion_date": "2026-10-07",
        "recipients": [{"name": "Secure User", "email": "secure@example.com"}]
    }
    create_res = client.post("/api/jobs", json=payload)
    job_id = create_res.json()["job_id"]

    process_job_background(job_id)

    status_res = client.get(f"/api/jobs/{job_id}")
    cert_id = status_res.json()["recipients"][0]["certificate_id"]

    dl_res = client.get(f"/api/certificates/{cert_id}/download")
    assert dl_res.status_code == 200
    assert dl_res.headers["content-type"] == "application/pdf"
    assert "attachment; filename=" in dl_res.headers["content-disposition"]
    assert len(dl_res.content) > 0


def test_non_existent_certificate_download(client):
    """Test downloading a non-existent certificate returns 404."""
    dl_res = client.get("/api/certificates/9999999/download")
    assert dl_res.status_code == 404
    data = dl_res.json()
    assert data["success"] is False
    assert data["message"] == "Certificate not found"
