import pytest


def test_create_generation_job_success(client):
    """Test successful job creation returns HTTP 202."""
    payload = {
        "course_name": "Full Stack Development",
        "completion_date": "2026-10-07",
        "recipients": [
            {"name": "Rahul Sharma", "email": "rahul@example.com"},
            {"name": "Priya Singh", "email": "priya@example.com"}
        ]
    }
    response = client.post("/api/jobs", json=payload)
    assert response.status_code == 202
    data = response.json()
    assert "job_id" in data
    assert data["status"] == "pending"
    assert data["total_recipients"] == 2


def test_list_jobs_pagination(client):
    """Test listing jobs with pagination."""
    # Create two jobs first
    for i in range(2):
        client.post("/api/jobs", json={
            "course_name": f"Course #{i+1}",
            "completion_date": "2026-10-07",
            "recipients": [{"name": f"User {i}", "email": f"user{i}@example.com"}]
        })

    response = client.get("/api/jobs?page=1&page_size=10")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2
    assert data["page"] == 1


def test_non_existent_job(client):
    """Test fetching job status for invalid job ID returns 404."""
    response = client.get("/api/jobs/999999")
    assert response.status_code == 404
    data = response.json()
    assert data["success"] is False
