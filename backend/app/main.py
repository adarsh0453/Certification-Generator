import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import engine, Base
from app.routers.jobs import router as jobs_router
from app.routers.certificates import router as certificates_router
from app.routers.auth import router as auth_router
from app.utils.file_utils import ensure_directory_exists

# Setup Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("bulk_certificate_generator")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup & shutdown tasks."""
    logger.info("Initializing Bulk Certificate Generator application...")
    ensure_directory_exists(settings.STORAGE_DIR)
    # Ensure database tables exist
    Base.metadata.create_all(bind=engine)
    logger.info("Database schema initialized successfully.")

    # Seed initial demo administrator if database has no users
    from app.database import SessionLocal
    from app.models.user import User
    from app.utils.auth_utils import get_password_hash
    with SessionLocal() as db:
        if not db.query(User).filter(User.email == "admin@aereo.io").first():
            demo_user = User(
                name="Admin User",
                email="admin@aereo.io",
                hashed_password=get_password_hash("admin123"),
                is_active=True,
            )
            db.add(demo_user)
            db.commit()
            logger.info("Default administrator account created: admin@aereo.io")

    yield
    logger.info("Shutting down Bulk Certificate Generator application...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Production-grade API for generating PDF certificates in bulk with background processing and job tracking.",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Format HTTP exceptions into consistent JSON output."""
    message = exc.detail
    if isinstance(exc.detail, dict) and "message" in exc.detail:
        message = exc.detail["message"]
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": message,
            "detail": exc.detail,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Format Pydantic validation errors cleanly."""
    errors = []
    for err in exc.errors():
        loc = " -> ".join([str(p) for p in err["loc"] if p != "body"])
        errors.append(f"{loc}: {err['msg']}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "message": "Validation failed for request payload",
            "errors": errors,
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """Catch unhandled server exceptions without exposing stack traces to client."""
    logger.exception(f"Unhandled exception on {request.method} {request.url}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An unexpected internal server error occurred. Please try again later.",
        },
    )


# Health check endpoint
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
    }


# Include Routers
app.include_router(jobs_router, prefix=settings.API_V1_STR)
app.include_router(certificates_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
