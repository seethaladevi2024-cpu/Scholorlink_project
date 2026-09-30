from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import User, StudentProfile
from app.schemas.domain import StudentProfileUpdate
from app.services.auth import get_current_user

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")
    
    return {
        "id": profile.id,
        "user_id": profile.user_id,
        "name": profile.name,
        "gender": profile.gender,
        "dob": profile.dob,
        "phone": profile.phone,
        "email": profile.email,
        "can_number": profile.can_number,
        "caste": profile.caste,
        "community": profile.community,
        "annual_income": profile.annual_income,
        "current_course": profile.current_course,
        "institution_name": profile.institution_name,
        "marks_percentage": profile.marks_percentage,
        "academic_year": profile.academic_year,
        "state": profile.state,
        "completion_percentage": profile.completion_percentage,
        "google_synced": profile.google_synced,
        "google_sync_notes": profile.google_sync_notes
    }

@router.put("/me")
def update_my_profile(payload: StudentProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    update_dict = payload.dict(exclude_unset=True)
    for field, val in update_dict.items():
        if val is not None:
            setattr(profile, field, val)

    # Recalculate completion percentage based on filled fields
    filled_fields = [
        profile.name, profile.gender, profile.dob, profile.phone, profile.email,
        profile.can_number, profile.caste, profile.community, profile.annual_income,
        profile.current_course, profile.institution_name, profile.marks_percentage
    ]
    calc_pct = int((sum(1 for f in filled_fields if f is not None and str(f).strip() != "") / len(filled_fields)) * 100)
    profile.completion_percentage = min(100, max(50, calc_pct))

    db.commit()
    db.refresh(profile)

    return {"message": "Profile updated successfully.", "profile": profile}
