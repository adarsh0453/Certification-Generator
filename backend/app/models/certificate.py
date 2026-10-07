from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(Integer, primary_key=True, index=True)
    recipient_id = Column(Integer, ForeignKey("recipients.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    certificate_number = Column(String(64), unique=True, index=True, nullable=False)
    file_path = Column(String(512), nullable=False)
    generated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    # Relationships
    recipient = relationship("Recipient", back_populates="certificate")
