import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.config import settings
from app.database import engine, Base
from app.seed import seed_database
from app.routers import (
    auth,
    students,
    scholarships,
    applications,
    documents,
    admin,
    sheets
)

# Initialize database schema
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ScholarLink Opportunity Intelligence Engine API",
    description="Production REST API for ScholarLink — Discover. Explain. Verify. Assist.",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(students.router, prefix=settings.API_PREFIX)
app.include_router(scholarships.router, prefix=settings.API_PREFIX)
app.include_router(applications.router, prefix=settings.API_PREFIX)
app.include_router(documents.router, prefix=settings.API_PREFIX)
app.include_router(admin.router, prefix=settings.API_PREFIX)
app.include_router(sheets.router, prefix=settings.API_PREFIX)

@app.on_event("startup")
def on_startup():
    # Automatically seed initial production-style knowledge base and accounts
    seed_database()

@app.get("/api/health")
def health_check():
    return {
        "status": "operational",
        "service": "ScholarLink Intelligence Engine API",
        "version": "1.0.0",
        "tagline": "Discover. Explain. Verify. Assist.",
        "google_sheet_destination": settings.GOOGLE_SHEET_ID
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
