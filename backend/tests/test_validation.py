import pytest


def test_empty_recipient_validation(client):
    """Test creating a job with empty recipients list fails validation."""
    payload = {
        "course_name": "Python Masterclass",
        "completion_date": "2026-10-07",
        "recipients": []
    }
    response = client.post("/api/jobs", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False


def test_invalid_email_validation(client):
    """Test creating a job with invalid recipient email format."""
    payload = {
        "course_name": "Python Masterclass",
        "completion_date": "2026-10-07",
        "recipients": [
            {"name": "Valid User", "email": "valid@example.com"},
            {"name": "Invalid User", "email": "not-an-email"}
        ]
    }
    response = client.post("/api/jobs", json=payload)
    assert response.status_code == 422
    data = response.json()
    assert data["success"] is False
    assert any("email" in err.lower() for err in data.get("errors", []))


def test_missing_course_name_validation(client):
    """Test missing or empty course_name fails validation."""
    payload = {
        "course_name": "   ",
        "completion_date": "2026-10-07",
        "recipients": [{"name": "Rahul Sharma", "email": "rahul@example.com"}]
    }
    response = client.post("/api/jobs", json=payload)
    assert response.status_code == 422


def test_invalid_completion_date(client):
    """Test invalid completion date string fails validation."""
    payload = {
        "course_name": "Python Masterclass",
        "completion_date": "invalid-date-xyz",
        "recipients": [{"name": "Rahul Sharma", "email": "rahul@example.com"}]
    }
    response = client.post("/api/jobs", json=payload)
    assert response.status_code == 422
