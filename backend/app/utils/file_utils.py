import csv
import io
import os
from typing import List, Dict, Tuple
from app.utils.validators import validate_email_address


def ensure_directory_exists(directory_path: str) -> str:
    """Ensure specified directory exists on filesystem."""
    os.makedirs(directory_path, exist_ok=True)
    return directory_path


def parse_recipients_csv(csv_content: str) -> Tuple[List[Dict[str, str]], List[str]]:
    """
    Parse uploaded CSV content into recipient dictionaries.
    Expects header with 'name' and 'email'.
    Returns (valid_recipients, error_messages).
    """
    valid_recipients = []
    errors = []

    try:
        # Normalize newlines
        stream = io.StringIO(csv_content)
        reader = csv.DictReader(stream)

        # Check fieldnames
        if not reader.fieldnames:
            return [], ["CSV file is empty or missing headers."]

        headers = [h.strip().lower() for h in reader.fieldnames if h]
        if "name" not in headers or "email" not in headers:
            return [], ["CSV must contain 'name' and 'email' headers."]

        # Map header variations
        name_key = next(h for h in reader.fieldnames if h.strip().lower() == "name")
        email_key = next(h for h in reader.fieldnames if h.strip().lower() == "email")

        line_num = 1
        for row in reader:
            line_num += 1
            name = (row.get(name_key) or "").strip()
            email = (row.get(email_key) or "").strip()

            if not name and not email:
                continue  # Skip empty row

            if not name:
                errors.append(f"Line {line_num}: Recipient name is missing.")
                continue

            if not email or not validate_email_address(email):
                errors.append(f"Line {line_num}: Invalid email '{email}'.")
                continue

            valid_recipients.append({"name": name, "email": email})

    except Exception as e:
        errors.append(f"Failed to parse CSV file: {str(e)}")

    return valid_recipients, errors
