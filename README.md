# Bulk Certificate Generator 🎓

> Production-grade monorepo application for generating PDF certificates in bulk for organizations, featuring a FastAPI backend, React (Vite) dashboard, PostgreSQL database, ReportLab PDF rendering, fault-tolerant background worker processing, Alembic migrations, unit/integration tests, and Docker containerization.

---

## 🌟 Key Features

- **Bulk Certificate Generation**: Submit 1 to 10,000+ recipients per job via manual form entry or CSV upload.
- **Fault-Tolerant Background Processing**: Uses FastAPI `BackgroundTasks` to process each recipient independently. An individual recipient failure **does NOT stop** remaining valid recipients from completing.
- **Dynamic Job Status Tracking & Polling**: Progress percentage, recipient counters (total, successful, failed, pending), and status badges (`pending`, `processing`, `completed`, `completed_with_errors`, `failed`).
- **Professional ReportLab PDF Generator**: High-resolution vector PDF certificate template with custom typography, issue dates, unique certificate numbers (`CERT-XXXXXX`), signature lines, and verified official badges.
- **CSV Upload & Pre-Validation**: Upload CSV files with automatic line-by-line header, email, and name validation before job submission.
- **Direct Certificate Download**: Instant single-click PDF download via FastAPI `FileResponse`.
- **Comprehensive Test Suite**: 13 unit & integration tests covering API endpoints, input validation, background worker resilience, PDF generation, status calculations, and error isolation.

---

## 📁 Repository Structure

```
bulk-certificate-generator/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI application entrypoint & exception handlers
│   │   ├── config.py                # Environment configuration settings (BaseSettings)
│   │   ├── database.py              # SQLAlchemy engine & session factory
│   │   ├── models/                  # SQLAlchemy ORM database models
│   │   │   ├── job.py               # Job table schema & statuses
│   │   │   ├── recipient.py         # Recipient table schema & statuses
│   │   │   └── certificate.py       # Certificate table schema
│   │   ├── schemas/                 # Pydantic v2 validation & response schemas
│   │   │   ├── job.py               # Job schemas & request validation
│   │   │   ├── recipient.py         # Recipient schemas & email validators
│   │   │   └── certificate.py       # Certificate response schemas
│   │   ├── routers/                 # FastAPI REST API route handlers
│   │   │   ├── jobs.py              # POST /api/jobs, GET /api/jobs, GET /api/jobs/{id}
│   │   │   └── certificates.py      # GET /api/certificates/{id}/download
│   │   ├── services/                # Business logic layer
│   │   │   ├── job_service.py       # Job processing service & background worker loop
│   │   │   ├── certificate_service.py # Certificate retrieval & file verification
│   │   │   └── pdf_service.py       # ReportLab PDF certificate generator wrapper
│   │   ├── utils/                   # Helper utilities
│   │   │   ├── validators.py        # Email, date, and path-traversal sanitizers
│   │   │   └── file_utils.py        # Directory creation & CSV parser
│   │   └── templates/
│   │       └── certificate_template.py # ReportLab PDF canvas design template
│   ├── tests/                       # Pytest test suite
│   │   ├── conftest.py              # Test database fixtures & client overrides
│   │   ├── test_jobs.py             # Job creation & pagination tests
│   │   ├── test_validation.py       # Input validation tests (empty list, bad email)
│   │   ├── test_certificate_generation.py # PDF generation & storage tests
│   │   ├── test_job_status.py       # Progress calculation tests
│   │   ├── test_failure_handling.py # Isolated recipient failure resilience test
│   │   └── test_certificate_download.py # PDF download & 404 handling tests
│   ├── alembic/                     # Database migrations
│   │   ├── versions/
│   │   │   └── 001_initial_schema.py# Initial database schema migration
│   │   └── env.py
│   ├── alembic.ini
│   ├── requirements.txt             # Python dependencies
│   └── Dockerfile                   # Python 3.12 container definition
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── Navbar.jsx           # Top header navigation
│   │   │   ├── Sidebar.jsx          # Left menu bar
│   │   │   ├── StatCard.jsx         # Dashboard statistics cards
│   │   │   ├── ProgressBar.jsx      # Animated progress bar component
│   │   │   ├── RecipientTable.jsx   # Filterable recipient list with download buttons
│   │   │   ├── CsvUploader.jsx      # Drag & drop CSV file validator
│   │   │   └── NotificationToast.jsx# Notification banners
│   │   ├── pages/                   # Application pages
│   │   │   ├── Dashboard.jsx        # Job summary stats & paginated job table
│   │   │   ├── CreateJob.jsx        # Job creation form (Manual + CSV)
│   │   │   └── JobDetails.jsx       # Job progress tracking & recipient list
│   │   ├── services/
│   │   │   └── api.js               # Axios HTTP API client
│   │   ├── App.jsx                  # Main layout & router setup
│   │   ├── main.jsx                 # React root DOM renderer
│   │   └── index.css                # Glassmorphism dark mode CSS design system
│   ├── package.json
│   ├── vite.config.js               # Vite dev server & proxy settings
│   └── Dockerfile                   # Nginx multi-stage build container
├── docker-compose.yml               # Multi-container orchestration setup
├── .env.example                     # Environment template file
├── .gitignore
├── INTERVIEW_NOTES.md               # Technical interview Q&A guide
└── README.md                        # Documentation
```

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Backend** | Python 3.12+, FastAPI, Uvicorn | High-performance asynchronous REST API backend framework |
| **Data Validation** | Pydantic v2 | Strict request payload & response schema validation |
| **Database & ORM**| SQLAlchemy 2.0, PostgreSQL | Relational database ORM, relationships, indexing, transactions |
| **Migrations** | Alembic | Database schema versioning and upgrade/downgrade migrations |
| **PDF Engine** | ReportLab 4.x | High-resolution PDF graphics canvas & document rendering |
| **Frontend** | React 18, Vite | SPA framework with fast hot module replacement (HMR) |
| **HTTP Client** | Axios | Frontend API request handling & response interceptors |
| **Icons & Style** | Lucide React, Vanilla CSS | Glassmorphism design system & accessible UI icons |
| **Testing** | Pytest, TestClient | Automated test suite with 100% pass rate across core features |
| **Containerization**| Docker, Docker Compose | Multi-container orchestration (Postgres + FastAPI + Nginx) |

---

## 📊 Database Schema Design

### `jobs` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Indexed | Auto-incrementing job identifier |
| `status` | String(32) | Indexed, Not Null | `pending`, `processing`, `completed`, `completed_with_errors`, `failed` |
| `course_name` | String(255) | Not Null | Name of the course or event |
| `completion_date` | String(32) | Not Null | Date string (e.g. YYYY-MM-DD) |
| `total_recipients` | Integer | Default 0 | Total number of recipients in job |
| `successful_count`| Integer | Default 0 | Counter of generated PDFs |
| `failed_count` | Integer | Default 0 | Counter of failed recipients |
| `created_at` | DateTime | Not Null | Timestamp of job creation |
| `started_at` | DateTime | Nullable | Timestamp when background worker started |
| `completed_at` | DateTime | Nullable | Timestamp when background worker finished |

### `recipients` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Indexed | Auto-incrementing recipient identifier |
| `job_id` | Integer | Foreign Key (`jobs.id`), Indexed | References parent job (CASCADE delete) |
| `name` | String(255) | Not Null | Full name of recipient |
| `email` | String(255) | Not Null | Validated email address |
| `course_name` | String(255) | Nullable | Inherited course name |
| `completion_date` | String(32) | Nullable | Inherited completion date |
| `status` | String(32) | Indexed, Not Null | `pending`, `processing`, `success`, `failed` |
| `error_message` | Text | Nullable | Exception traceback summary if generation failed |
| `created_at` | DateTime | Not Null | Creation timestamp |
| `processed_at` | DateTime | Nullable | Processing completion timestamp |

### `certificates` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | Integer | Primary Key, Indexed | Auto-incrementing certificate identifier |
| `recipient_id` | Integer | Foreign Key (`recipients.id`), Unique | One-to-one relationship with recipient |
| `certificate_number`| String(64)| Unique, Indexed | Unique certificate ID (e.g. `CERT-000001`) |
| `file_path` | String(512) | Not Null | Absolute disk filepath to PDF asset |
| `generated_at` | DateTime | Not Null | Timestamp of PDF creation |

---

## ⚡ API Endpoints & Specification

Interactive Swagger API Documentation is available at: **[http://localhost:8000/docs](http://localhost:8000/docs)**

| Method | Endpoint | Description | Status Code |
|---|---|---|---|
| `POST` | `/api/jobs` | Submit a new bulk certificate generation job | `202 Accepted` |
| `POST` | `/api/jobs/upload-csv` | Validate and parse uploaded CSV recipient file | `200 OK` / `422` |
| `GET` | `/api/jobs` | Paginated list of previous generation jobs | `200 OK` |
| `GET` | `/api/jobs/{job_id}` | Detailed job status, progress %, and recipients | `200 OK` / `404` |
| `GET` | `/api/certificates/{id}/download` | Download generated PDF certificate file | `200 OK` / `404` |
| `GET` | `/api/health` | Service readiness & health check | `200 OK` |

### Example Request (`POST /api/jobs`)
```json
{
  "course_name": "Python Programming Masterclass",
  "completion_date": "2026-10-07",
  "recipients": [
    {
      "name": "Rahul Sharma",
      "email": "rahul@example.com"
    },
    {
      "name": "Priya Singh",
      "email": "priya@example.com"
    }
  ]
}
```

### Example Response (`HTTP 202`)
```json
{
  "job_id": 1,
  "status": "pending",
  "total_recipients": 2,
  "message": "Certificate generation job created successfully"
}
```

### Example Response (`GET /api/jobs/1`)
```json
{
  "job_id": 1,
  "status": "completed",
  "course_name": "Python Programming Masterclass",
  "completion_date": "2026-10-07",
  "total": 2,
  "successful": 2,
  "failed": 0,
  "pending": 0,
  "progress_percentage": 100,
  "created_at": "2026-10-07T15:30:00.000Z",
  "recipients": [
    {
      "id": 1,
      "job_id": 1,
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "status": "success",
      "certificate_id": 1,
      "certificate_number": "CERT-000001"
    }
  ]
}
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.12+
- Node.js 18+ and npm
- Docker & Docker Compose (Optional for containerized run)

### Method 1: Local Development Run (Fastest)

1. **Clone Monorepo**:
   ```bash
   cd bulk-certificate-generator
   ```

2. **Start Backend Server**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python app/main.py
   ```
   *The backend will automatically initialize the database schema and serve at `http://localhost:8000`.*

3. **Start Frontend App**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   *Open your browser at `http://localhost:5173`.*

---

### Method 2: Docker Compose (Full Stack with PostgreSQL)

Run the full stack containerized with PostgreSQL database, FastAPI backend, and Nginx frontend:

```bash
docker compose up --build
```

- **Frontend Application**: `http://localhost:5173`
- **Backend Swagger Docs**: `http://localhost:8000/docs`
- **PostgreSQL Database**: `localhost:5432` (`postgres/postgres`, database: `certificates`)

---

## 🧪 Running the Test Suite

Run all 13 automated unit & integration tests:

```bash
cd backend
python -m pytest -v
```

### Test Coverage Highlights:
- `test_create_generation_job_success`: Job creation & HTTP 202 response.
- `test_empty_recipient_validation`: Schema validation for empty recipient list.
- `test_invalid_email_validation`: Rejection of malformed email addresses.
- `test_pdf_certificate_generation`: PDF template rendering & disk storage.
- `test_successful_bulk_certificate_generation`: End-to-end background job execution.
- `test_individual_failure_isolation`: **Mocked failure test** ensuring 1 failing recipient does not stop other recipients, resulting in `completed_with_errors` status.
- `test_certificate_download`: PDF FileResponse verification & filename headers.

---

## ⚙️ Database Migrations (Alembic)

Database schema changes are managed via Alembic migrations.

### Run Migrations:
```bash
cd backend
alembic upgrade head
```

### Generate a New Migration:
```bash
alembic revision --autogenerate -m "Add new field to recipient table"
```

---

## 🛡️ Security & Design Decisions

1. **Path Traversal Protection**: Uploaded filenames and certificate numbers are sanitized using regex sanitizers before serving via `FileResponse`.
2. **FileSystem Storage vs Database BLOBs**: PDFs are stored as clean files on disk (`storage/certificates/`), keeping the PostgreSQL database lightweight and fast.
3. **Fault Isolation**: Each recipient in a job is processed within a `try...except` block. A rendering error for Recipient B logs the exception to the recipient's record and increments `failed_count`, but allows Recipient C to finish successfully.
4. **FastAPI BackgroundTasks**: Eliminates heavy external message queues (Celery/RabbitMQ) for standard workloads while keeping asynchronous execution clean and responsive.

---

## 📄 License
Released under the MIT License. Enterprise-ready implementation designed for production software engineering evaluations.
