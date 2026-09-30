import uuid
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Application, Scholarship, User, StudentProfile
from app.schemas.domain import ApplicationCreateRequest
from app.services.auth import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.post("/")
def create_application(
    payload: ApplicationCreateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    scholarship = db.query(Scholarship).filter(Scholarship.id == payload.scholarship_id).first()
    if not scholarship:
        raise HTTPException(status_code=404, detail="Scholarship not found.")
        
    # Check if already applied
    existing = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.scholarship_id == payload.scholarship_id
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"You have already applied for this scholarship (Application ID: {existing.application_number})."
        )
        
    app_num = f"SL-{datetime.datetime.utcnow().year}-{uuid.uuid4().hex[:6].upper()}"
    new_app = Application(
        application_number=app_num,
        user_id=current_user.id,
        scholarship_id=scholarship.id,
        status="Under Verification",
        current_stage="verify", # Stages: discover -> understand -> apply -> verify -> track
        verification_notes="Application submitted successfully. Candidate documents undergoing verification."
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    
    return {
        "id": new_app.id,
        "application_number": new_app.application_number,
        "scholarship_id": scholarship.id,
        "scholarship_title": scholarship.title,
        "provider": scholarship.provider,
        "amount_display": scholarship.amount_display,
        "status": new_app.status,
        "current_stage": new_app.current_stage,
        "submitted_at": new_app.submitted_at.strftime("%d %b %Y"),
        "updated_at": new_app.updated_at.strftime("%d %b %Y"),
        "verification_notes": new_app.verification_notes
    }

@router.get("/")
def list_applications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role in ["ADMIN", "VERIFIER"]:
        apps = db.query(Application).order_by(Application.submitted_at.desc()).all()
    else:
        apps = db.query(Application).filter(Application.user_id == current_user.id).order_by(Application.submitted_at.desc()).all()
        
    results = []
    for a in apps:
        results.append({
            "id": a.id,
            "application_number": a.application_number,
            "user_id": a.user_id,
            "student_name": a.user.full_name if a.user else "Candidate",
            "scholarship_id": a.scholarship_id,
            "scholarship_title": a.scholarship.title if a.scholarship else "Scholarship",
            "provider": a.scholarship.provider if a.scholarship else "Authority",
            "amount_display": a.scholarship.amount_display if a.scholarship else "Standard Disbursal",
            "status": a.status,
            "current_stage": a.current_stage,
            "submitted_at": a.submitted_at.strftime("%d %b %Y"),
            "updated_at": a.updated_at.strftime("%d %b %Y"),
            "verification_notes": a.verification_notes
        })
    return results

@router.get("/{application_id}")
def get_application_detail(application_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    a = db.query(Application).filter(Application.id == application_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Application not found.")
        
    if a.user_id != current_user.id and current_user.role not in ["ADMIN", "VERIFIER"]:
        raise HTTPException(status_code=403, detail="Not authorized to view this application.")

    return {
        "id": a.id,
        "application_number": a.application_number,
        "user_id": a.user_id,
        "student_name": a.user.full_name if a.user else "Candidate",
        "scholarship_id": a.scholarship_id,
        "scholarship_title": a.scholarship.title if a.scholarship else "Scholarship",
        "provider": a.scholarship.provider if a.scholarship else "Authority",
        "amount_display": a.scholarship.amount_display if a.scholarship else "Standard Disbursal",
        "status": a.status,
        "current_stage": a.current_stage,
        "submitted_at": a.submitted_at.strftime("%d %b %Y"),
        "updated_at": a.updated_at.strftime("%d %b %Y"),
        "verification_notes": a.verification_notes
    }
