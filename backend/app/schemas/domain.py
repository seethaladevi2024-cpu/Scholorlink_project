from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

# --- Auth & Student Schemas ---
class StudentRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, description="Full student legal name")
    gender: str = Field(..., description="Gender (Male, Female, Other, Prefer not to say)")
    dob: str = Field(..., description="Date of birth YYYY-MM-DD")
    phone: str = Field(..., min_length=10, max_length=15, description="Mobile phone number")
    email: EmailStr = Field(..., description="Primary contact email")
    can_number: str = Field(..., min_length=4, description="Candidate Application Number (CAN)")
    caste: str = Field(..., description="Caste category (General, OBC, SC, ST, EWS, Minority)")
    community: str = Field(..., description="Community name or classification")
    
    # Optional extended attributes
    annual_income: Optional[float] = 180000.0
    current_course: Optional[str] = "B.Tech Computer Science & Engineering"
    institution_name: Optional[str] = "National Institute of Technology"
    marks_percentage: Optional[float] = 84.5

class LoginRequest(BaseModel):
    email_or_can: str = Field(..., description="Email address or CAN Number")
    password: Optional[str] = "student123"

class RoleSwitchRequest(BaseModel):
    role: str = Field(..., description="Target role: STUDENT, VERIFIER, ADMIN")

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    profile: Optional[Dict[str, Any]] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
    google_sheet_status: Optional[Dict[str, Any]] = None

# --- Student Profile Schemas ---
class StudentProfileUpdate(BaseModel):
    name: Optional[str] = None
    gender: Optional[str] = None
    dob: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    caste: Optional[str] = None
    community: Optional[str] = None
    annual_income: Optional[float] = None
    current_course: Optional[str] = None
    institution_name: Optional[str] = None
    marks_percentage: Optional[float] = None
    state: Optional[str] = None

# --- Scholarship Schemas ---
class RuleSchema(BaseModel):
    min_marks: float
    max_income: float
    allowed_castes: List[str]
    allowed_courses: List[str]
    required_documents: List[str]
    gender_preference: str = "ANY"
    rule_version: str = "1.0"
    last_modified_by: str = "Admin Policy Cell"

class ScholarshipResponse(BaseModel):
    id: int
    title: str
    provider: str
    category: str
    amount_display: str
    amount_value: float
    deadline: str
    description: str
    application_url: str
    is_active: bool
    version: str
    last_updated: str
    match_percentage: Optional[int] = 85
    eligibility_status: Optional[str] = "Potentially Eligible"
    why_you_match: Optional[List[str]] = []
    missing_info: Optional[List[str]] = []
    rules: Optional[Dict[str, Any]] = None

class ScholarshipCreateUpdate(BaseModel):
    title: str
    provider: str
    category: str
    amount_display: str
    amount_value: float
    deadline: str
    description: str
    min_marks: float = 50.0
    max_income: float = 250000.0
    allowed_castes: List[str] = ["ALL"]
    allowed_courses: List[str] = ["ALL"]
    required_documents: List[str] = ["Income Certificate", "Caste Certificate", "Academic Marksheet"]
    gender_preference: str = "ANY"

# --- Document Schemas ---
class DocumentResponse(BaseModel):
    id: int
    user_id: int
    document_type: str
    original_filename: str
    file_size: int
    uploaded_at: str
    ocr_status: str
    ocr_confidence: float
    extracted_data: Dict[str, Any]
    verification_status: str
    verified_by: Optional[str] = None
    verification_notes: Optional[str] = None

# --- Application Schemas ---
class ApplicationCreateRequest(BaseModel):
    scholarship_id: int

class ApplicationResponse(BaseModel):
    id: int
    application_number: str
    user_id: int
    scholarship_id: int
    scholarship_title: str
    provider: str
    amount_display: str
    status: str
    current_stage: str
    submitted_at: str
    updated_at: str
    verification_notes: str

class ApplicationActionRequest(BaseModel):
    action: str = Field(..., description="APPROVE, REJECT, REQUEST_CORRECTION")
    notes: Optional[str] = ""

# --- Google Sheets Status ---
class SheetSyncStatus(BaseModel):
    configured: bool
    sheet_id: str
    sheet_url: str
    status: str
    message: str
    last_attempt_at: Optional[str] = None
