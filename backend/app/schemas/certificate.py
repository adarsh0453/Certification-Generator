from datetime import datetime
from pydantic import BaseModel, ConfigDict


class CertificateResponse(BaseModel):
    id: int
    recipient_id: int
    certificate_number: str
    file_path: str
    generated_at: datetime

    model_config = ConfigDict(from_attributes=True)
