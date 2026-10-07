# 🎓 Technical Interview Guide & Architectural Notes

This document provides clear, concise, and interview-ready answers for technical questions about the architecture, implementation choices, scalability, and design decisions of the **Bulk Certificate Generator** application.

---

### 1. Why FastAPI?
**Answer:**
> "FastAPI was chosen because it provides high asynchronous performance comparable to Node.js and Go, while offering automatic data validation using Pydantic, seamless OpenAPI/Swagger documentation out of the box, and built-in background task execution (`BackgroundTasks`). Its clean dependency injection system makes database sessions and request validation trivial to maintain and test."

---

### 2. Why PostgreSQL?
**Answer:**
> "PostgreSQL is an enterprise-grade ACID-compliant relational database. It is ideal for storing structured job and recipient data with foreign-key integrity, indexes on frequently queried fields (like `job_id`, `status`, and `certificate_number`), and row-level locking capabilities if scaled to high concurrency."

---

### 3. Why SQLAlchemy 2.0?
**Answer:**
> "SQLAlchemy is the Python standard for ORM. Version 2.0 introduces clean type hints, modern query syntax (`select()`, `filter()`), explicit session lifecycle management, and migration support via Alembic. It decouples business logic from SQL dialect specifics, allowing us to seamlessly run SQLite for fast pytest unit tests and PostgreSQL in production."

---

### 4. Why Pydantic v2?
**Answer:**
> "Pydantic performs strict runtime data validation and serialization written in Rust. It guarantees that invalid payloads (such as empty recipient lists, missing course names, or malformed email addresses) are caught immediately at the HTTP boundary before reaching database or business logic layers."

---

### 5. Why Background Processing?
**Answer:**
> "Generating PDFs is a CPU and I/O intensive operation. Generating 100+ PDFs synchronously inside a standard HTTP request handler would block the request thread, cause HTTP client timeouts, and create a terrible user experience. By returning HTTP 202 Accepted immediately and processing certificates asynchronously in the background, the API remains responsive."

---

### 6. How does Bulk Processing work step-by-step?
**Answer:**
> 1. Client sends `POST /api/jobs` with course metadata & recipient roster.
> 2. Backend validates schema using Pydantic, inserts a `Job` record (`status: pending`) and `Recipient` records (`status: pending`).
> 3. API returns HTTP 202 Accepted with `job_id`.
> 4. `BackgroundTasks.add_task` launches `process_job_background(job_id)`.
> 5. Worker updates `job.status = processing`.
> 6. Worker loops through recipients: marks status `processing`, generates PDF via ReportLab, creates `Certificate` DB record, marks status `success`, and increments `successful_count`.
> 7. If an individual recipient fails, exception is caught, status set to `failed`, error stored, and `failed_count` incremented.
> 8. Once loop finishes, job status transitions to `completed` or `completed_with_errors`.

---

### 7. What happens if one certificate fails?
**Answer:**
> "Fault isolation is built into the background worker loop. Each recipient is wrapped in an isolated `try...except` block. If Recipient #2 raises a rendering or disk write error, that error is caught, the recipient status is set to `failed` with the error message logged, `failed_count` is incremented, and the loop proceeds immediately to Recipient #3. The final job status resolves to `completed_with_errors` rather than failing the entire batch."

---

### 8. How is Progress Calculated?
**Answer:**
> "Progress percentage is dynamically computed using:
> $$\text{Progress \%} = \left\lfloor \frac{\text{successful\_count} + \text{failed\_count}}{\text{total\_recipients}} \times 100 \right\rfloor$$
> Pending count is calculated as $\max(0, \text{total} - (\text{successful} + \text{failed}))$. This prevents divide-by-zero errors and ensures accuracy regardless of job state."

---

### 9. How is Certificate Uniqueness Guaranteed?
**Answer:**
> "Uniqueness is guaranteed at both application and database layers:
> 1. Application layer formats certificate numbers as `CERT-{recipient_id:06d}`.
> 2. Database schema applies a `UNIQUE` constraint and index on `certificates.certificate_number` and `certificates.recipient_id`.
> 3. If a duplicate insertion were attempted, database integrity rules prevent duplicate rows."

---

### 10. Why store PDF filepaths on disk instead of PDF binary data in PostgreSQL?
**Answer:**
> "Storing large binary BLOBs inside relational databases bloats database backups, increases memory usage, slows table scans, and consumes expensive database storage. Storing files on local disk (or cloud object storage like AWS S3 / Google Cloud Storage) and saving only the lightweight string path in PostgreSQL follows 12-factor application design and allows CDN caching."

---

### 11. How does the Frontend communicate with the Backend?
**Answer:**
> "The React frontend uses Axios configured with a base URL (`/api`). Requests send JSON payloads for job creation and `multipart/form-data` for CSV file uploads. The backend uses FastAPI `CORSMiddleware` to allow cross-origin requests from the React dev server (`http://localhost:5173`)."

---

### 12. How does Polling work on the Job Details Page?
**Answer:**
> "When a user opens `/jobs/:jobId`, a React `useEffect` hook issues a request to `GET /api/jobs/:jobId`. If `job.status` is `pending` or `processing`, a `setInterval` timer triggers polling every 2.5 seconds. As soon as the job status becomes `completed` or `completed_with_errors`, the timer is automatically cleared via `clearInterval` to conserve network bandwith."

---

### 13. How would you scale this application to 100,000+ certificates?
**Answer:**
> 1. **Distributed Queue**: Replace FastAPI `BackgroundTasks` with Celery or Redis Queue (RQ) and RabbitMQ/Redis.
> 2. **Worker Pool**: Spin up multiple stateless worker nodes to process recipient batches in parallel.
> 3. **Object Storage**: Store generated PDFs on Amazon S3 / Google Cloud Storage with presigned download URLs.
> 4. **Batch DB Writes**: Bulk insert recipients (`bulk_insert_mappings`) instead of single row commits.
> 5. **WebSockets/Server-Sent Events (SSE)**: Replace HTTP polling with real-time push notifications over WebSockets.

---

### 14. How would you introduce Celery & Redis in production?
**Answer:**
> "We would configure a Celery app instance backed by Redis as the message broker and result backend. Upon job creation, `create_job.delay(job_id)` would push tasks into Redis. Multiple Celery worker processes across separate container nodes would pull recipient sub-batches concurrently."

---

### 15. How would you handle Concurrent Jobs?
**Answer:**
> "Using database connection pooling (SQLAlchemy `QueuePool`), atomic status updates (`UPDATE jobs SET status='processing' WHERE id=:id AND status='pending'`), and separate worker processes. PostgreSQL row-level locks prevent race conditions when multiple jobs execute simultaneously."

---

### 16. How would you secure the APIs?
**Answer:**
> 1. **Authentication**: Implement JWT token authentication (OAuth2 with Password Bearer or Auth0/Okta).
> 2. **Authorization & RBAC**: Ensure users can only view and download certificates belonging to their organization.
> 3. **Rate Limiting**: Add slowapi / Redis rate limiting (e.g., max 10 job submissions per minute).
> 4. **Path Traversal Protection**: Sanitize all file download paths.

---

### 17. How would you prevent Duplicate Jobs?
**Answer:**
> "Generate an idempotency key (e.g. SHA-256 hash of `course_name + completion_date + recipient_emails`). If a duplicate request with the same idempotency key arrives within a 5-minute window, return the existing `job_id` instead of creating a new job."

---

### 18. How would you retry Failed Certificates?
**Answer:**
> "Add a `POST /api/jobs/{job_id}/retry-failed` endpoint that queries recipients where `status = 'failed'`, resets their status to `pending`, and re-queues them through the background processing loop."

---

### 19. How would you monitor background jobs in production?
**Answer:**
> "Use Prometheus metrics exporters for job processing durations, Grafana dashboards for success/failure rates, Sentry for tracking unhandled PDF rendering tracebacks, and Healthcheck endpoints."
