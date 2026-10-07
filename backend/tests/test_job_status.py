import pytest


def test_job_status_progress_calculation(client, db_session):
    """Test job status endpoint returns calculated progress percentages and recipient detail."""
    payload = {
        "course_name": "Cloud Computing",
        "completion_date": "2026-10-07",
        "recipients": [
            {"name": "Amit Kumar", "email": "amit@example.com"},
            {"name": "Neha Gupta", "email": "neha@example.com"}
        ]
    }
    create_res = client.post("/api/jobs", json=payload)
    job_id = create_res.json()["job_id"]

    # TestClient automatically executes background tasks synchronously
    res_done = client.get(f"/api/jobs/{job_id}")
    assert res_done.status_code == 200
    data_done = res_done.json()
    assert data_done["status"] == "completed"
    assert data_done["progress_percentage"] == 100
    assert data_done["successful"] == 2
    assert data_done["failed"] == 0
    assert data_done["pending"] == 0
    assert len(data_done["recipients"]) == 2
