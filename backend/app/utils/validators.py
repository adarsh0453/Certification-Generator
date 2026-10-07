import re
from datetime import datetime
from typing import Tuple

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


def validate_email_address(email: str) -> bool:
    """Validate string email format."""
    if not email or not isinstance(email, str):
        return False
    return bool(EMAIL_REGEX.match(email.strip()))


def validate_date_string(date_str: str) -> bool:
    """Validate date string format (supports YYYY-MM-DD, DD/MM/YYYY, etc.)."""
    if not date_str or not isinstance(date_str, str):
        return False
    date_str = date_str.strip()
    formats = [
        "%Y-%m-%d",
        "%d/%m/%Y",
        "%m/%d/%Y",
        "%d-%m-%Y",
        "%Y/%m/%d",
        "%d %B %Y",
        "%d %b %Y",
    ]
    for fmt in formats:
        try:
            datetime.strptime(date_str, fmt)
            return True
        except ValueError:
            continue
    return False


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent path traversal security vulnerabilities."""
    cleaned = re.sub(r"[^\w\-. ]", "_", filename)
    return cleaned.strip()
