from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.utils.validators import validate_email_address


class RecipientCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200, example="Rahul Sharma")
    email: str = Field(..., example="rahul@example.com")

    @field_validator("name")
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Recipient name cannot be empty")
        return v

    @field_validator("email")
    def validate_email(cls, v: str) -> str:
        v = v.strip().lower()
        if not validate_email_address(v):
            raise ValueError(f"Invalid email address format: '{v}'")
        return v


class RecipientResponse(BaseModel):
    id: int
    job_id: int
    name: str
    email: str
    course_name: Optional[str] = None
    completion_date: Optional[str] = None
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    processed_at: Optional[datetime] = None
    certificate_id: Optional[int] = None
    certificate_number: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
