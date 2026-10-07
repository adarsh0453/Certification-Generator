from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.schemas.recipient import RecipientCreate, RecipientResponse
from app.utils.validators import validate_date_string


class JobCreate(BaseModel):
    course_name: str = Field(..., min_length=1, max_length=255, example="Python Programming")
    completion_date: str = Field(..., example="2026-10-07")
    recipients: List[RecipientCreate] = Field(..., min_length=1, example=[{"name": "Rahul Sharma", "email": "rahul@example.com"}])

    @field_validator("course_name")
    def validate_course(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Course/Event name is required")
        return v

    @field_validator("completion_date")
    def validate_date(cls, v: str) -> str:
        v = v.strip()
        if not validate_date_string(v):
            raise ValueError("Completion date must be a valid date format (e.g. YYYY-MM-DD or DD/MM/YYYY)")
        return v

    @field_validator("recipients")
    def validate_recipients_list(cls, v: List[RecipientCreate]) -> List[RecipientCreate]:
        if not v or len(v) == 0:
            raise ValueError("Recipients list cannot be empty")
        return v


class JobCreateResponse(BaseModel):
    job_id: int
    status: str
    total_recipients: int
    message: str = "Certificate generation job created"


class JobStatusResponse(BaseModel):
    job_id: int
    status: str
    course_name: str
    completion_date: str
    total: int
    successful: int
    failed: int
    pending: int
    progress_percentage: int
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    recipients: List[RecipientResponse] = []

    model_config = ConfigDict(from_attributes=True)


class JobListItem(BaseModel):
    job_id: int
    course_name: str
    completion_date: str
    status: str
    total_recipients: int
    successful_count: int
    failed_count: int
    created_at: datetime
    completed_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class JobListPaginatedResponse(BaseModel):
    items: List[JobListItem]
    total: int
    page: int
    page_size: int
    total_pages: int
