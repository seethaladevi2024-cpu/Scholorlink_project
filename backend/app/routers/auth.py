from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import User, StudentProfile
from app.schemas.domain import (
    StudentRegisterRequest,
    LoginRequest,
    RoleSwitchRequest,
    TokenResponse,
    UserResponse
)
from app.services.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user
)
from app.services.google_sheets import sync_student_to_google_sheet

router = APIRouter(prefix="/auth", tags=["Authentication"])

def format_user_response(user: User) -> dict:
    profile_data = None
    if user.profile:
        p = user.profile
        profile_data = {
            "id": p.id,
            "name": p.name,
            "gender": p.gender,
            "dob": p.dob,
            "phone": p.phone,
            "email": p.email,
            "can_number": p.can_number,
            "caste": p.caste,
            "community": p.community,
            "annual_income": p.annual_income,
            "current_course": p.current_course,
            "institution_name": p.institution_name,
            "marks_percentage": p.marks_percentage,
            "completion_percentage": p.completion_percentage,
            "google_synced": p.google_synced,
            "google_sync_notes": p.google_sync_notes
        }
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "role": user.role,
        "is_active": user.is_active,
        "profile": profile_data
    }

@router.post("/register", response_model=TokenResponse)
async def register_student(payload: StudentRegisterRequest, db: Session = Depends(get_db)):
    # Check if student email or CAN already exists
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An account with email {payload.email} already exists."
        )

    existing_can = db.query(StudentProfile).filter(StudentProfile.can_number == payload.can_number).first()
    if existing_can:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Candidate Application Number {payload.can_number} is already registered."
        )

    # 1. Create Core User
    new_user = User(
        email=payload.email,
        full_name=payload.name,
        hashed_password=hash_password("student123"), # Default student password
        role="STUDENT"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # 2. Create Student Profile with the 8 required fields
    new_profile = StudentProfile(
        user_id=new_user.id,
        name=payload.name,
        gender=payload.gender,
        dob=payload.dob,
        phone=payload.phone,
        email=payload.email,
        can_number=payload.can_number,
        caste=payload.caste,
        community=payload.community,
        annual_income=payload.annual_income or 180000.0,
        current_course=payload.current_course or "B.Tech Computer Science & Engineering",
        institution_name=payload.institution_name or "National Institute of Technology",
        marks_percentage=payload.marks_percentage or 84.5,
        completion_percentage=85
    )
    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    # 3. Synchronize with configured Google Sheet destination
    sheet_result = await sync_student_to_google_sheet(payload.dict())
    
    new_profile.google_synced = (sheet_result.get("status") == "synced")
    new_profile.google_sync_notes = sheet_result.get("message", "")
    db.commit()
    db.refresh(new_user)

    # 4. Generate Access Token
    token = create_access_token({"sub": new_user.id, "role": new_user.role, "email": new_user.email})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": format_user_response(new_user),
        "google_sheet_status": sheet_result
    }

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    query_val = payload.email_or_can.strip()
    user = db.query(User).filter(User.email == query_val).first()
    
    if not user:
        # Check CAN number in profile
        profile = db.query(StudentProfile).filter(StudentProfile.can_number == query_val).first()
        if profile:
            user = db.query(User).filter(User.id == profile.user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials: Email or CAN number not recognized."
        )

    token = create_access_token({"sub": user.id, "role": user.role, "email": user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": format_user_response(user)
    }

@router.post("/switch-role", response_model=TokenResponse)
def switch_role(payload: RoleSwitchRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    target_role = payload.role.upper()
    if target_role not in ["STUDENT", "VERIFIER", "ADMIN"]:
        raise HTTPException(status_code=400, detail="Invalid role specified.")
    
    current_user.role = target_role
    db.commit()
    db.refresh(current_user)

    token = create_access_token({"sub": current_user.id, "role": current_user.role, "email": current_user.email})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": format_user_response(current_user)
    }

@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return format_user_response(current_user)
