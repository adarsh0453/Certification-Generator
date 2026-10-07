"""Initial database schema for jobs, recipients, and certificates

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-07 15:30:00

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa


revision: str = "001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create jobs table
    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="pending"),
        sa.Column("course_name", sa.String(length=255), nullable=False),
        sa.Column("completion_date", sa.String(length=32), nullable=False),
        sa.Column("total_recipients", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("successful_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("failed_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_jobs_id"), "jobs", ["id"], unique=False)
    op.create_index(op.f("ix_jobs_status"), "jobs", ["status"], unique=False)

    # Create recipients table
    op.create_table(
        "recipients",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("job_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("course_name", sa.String(length=255), nullable=True),
        sa.Column("completion_date", sa.String(length=32), nullable=True),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="pending"),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("processed_at", sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(["job_id"], ["jobs.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_recipients_id"), "recipients", ["id"], unique=False)
    op.create_index(op.f("ix_recipients_job_id"), "recipients", ["job_id"], unique=False)
    op.create_index(op.f("ix_recipients_status"), "recipients", ["status"], unique=False)

    # Create certificates table
    op.create_table(
        "certificates",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("recipient_id", sa.Integer(), nullable=False),
        sa.Column("certificate_number", sa.String(length=64), nullable=False),
        sa.Column("file_path", sa.String(length=512), nullable=False),
        sa.Column("generated_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["recipient_id"], ["recipients.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("certificate_number"),
        sa.UniqueConstraint("recipient_id"),
    )
    op.create_index(op.f("ix_certificates_id"), "certificates", ["id"], unique=False)
    op.create_index(op.f("ix_certificates_recipient_id"), "certificates", ["recipient_id"], unique=True)
    op.create_index(op.f("ix_certificates_certificate_number"), "certificates", ["certificate_number"], unique=True)


def downgrade() -> None:
    op.drop_index(op.f("ix_certificates_certificate_number"), table_name="certificates")
    op.drop_index(op.f("ix_certificates_recipient_id"), table_name="certificates")
    op.drop_index(op.f("ix_certificates_id"), table_name="certificates")
    op.drop_table("certificates")

    op.drop_index(op.f("ix_recipients_status"), table_name="recipients")
    op.drop_index(op.f("ix_recipients_job_id"), table_name="recipients")
    op.drop_index(op.f("ix_recipients_id"), table_name="recipients")
    op.drop_table("recipients")

    op.drop_index(op.f("ix_jobs_status"), table_name="jobs")
    op.drop_index(op.f("ix_jobs_id"), table_name="jobs")
    op.drop_table("jobs")
