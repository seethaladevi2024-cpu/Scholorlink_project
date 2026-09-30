import datetime
import json
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    role = Column(String(50), default="STUDENT") # STUDENT, VERIFIER, ADMIN
    full_name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    profile = relationship("StudentProfile", back_populates="user", uselist=False)
    documents = relationship("Document", back_populates="user")
    applications = relationship("Application", back_populates="user")

class StudentProfile(Base):
    __tablename__ = "student_profiles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    
    # 8 Required Fields from Specification
    name = Column(String(255), nullable=False)
    gender = Column(String(50), nullable=False)
    dob = Column(String(50), nullable=False)
    phone = Column(String(50), nullable=False)
    email = Column(String(255), nullable=False)
    can_number = Column(String(100), unique=True, index=True, nullable=False)
    caste = Column(String(100), nullable=False)
    community = Column(String(100), nullable=False)
    
    # Extended Profile attributes for accurate matching
    annual_income = Column(Float, default=180000.0)
    current_course = Column(String(255), default="B.Tech Computer Science & Engineering")
    institution_name = Column(String(255), default="National Institute of Technology")
    marks_percentage = Column(Float, default=84.5)
    academic_year = Column(String(50), default="2025-2026")
    state = Column(String(100), default="National")
    
    # System metrics
    completion_percentage = Column(Integer, default=85)
    google_synced = Column(Boolean, default=False)
    google_sync_notes = Column(Text, default="Pending sync with configured Google Sheet destination.")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    user = relationship("User", back_populates="profile")

class Scholarship(Base):
    __tablename__ = "scholarships"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    provider = Column(String(255), nullable=False) # e.g. Ministry of Social Justice & Empowerment
    category = Column(String(100), nullable=False) # Post-Matric, Pre-Matric, Merit-cum-Means, Higher Education
    amount_display = Column(String(100), nullable=False) # e.g. ₹50,000 / year + Maintenance
    amount_value = Column(Float, default=50000.0)
    deadline = Column(String(50), nullable=False)
    description = Column(Text, nullable=False)
    application_url = Column(String(500), default="/apply")
    is_active = Column(Boolean, default=True)
    version = Column(String(50), default="v1.2")
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
    
    rules = relationship("ScholarshipRule", back_populates="scholarship", uselist=False)
    applications = relationship("Application", back_populates="scholarship")

class ScholarshipRule(Base):
    __tablename__ = "scholarship_rules"
    
    id = Column(Integer, primary_key=True, index=True)
    scholarship_id = Column(Integer, ForeignKey("scholarships.id"), unique=True, nullable=False)
    
    min_marks = Column(Float, default=50.0)
    max_income = Column(Float, default=250000.0)
    allowed_castes = Column(Text, default='["ALL"]') # JSON list: e.g. ["SC", "ST", "OBC", "General"]
    allowed_courses = Column(Text, default='["ALL"]')
    required_documents = Column(Text, default='["Income Certificate", "Caste Certificate", "Academic Marksheet"]')
    gender_preference = Column(String(50), default="ANY") # ANY, FEMALE, etc.
    rule_version = Column(String(50), default="1.2")
    last_modified_by = Column(String(100), default="Admin Policy Cell")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    scholarship = relationship("Scholarship", back_populates="rules")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    document_type = Column(String(100), nullable=False) # Income Certificate, Community/Caste Certificate, Academic Certificate, Identity Document, Bank Details
    original_filename = Column(String(255), nullable=False)
    stored_path = Column(String(500), nullable=False)
    file_size = Column(Integer, default=0)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # OCR and Verification pipeline attributes
    ocr_status = Column(String(50), default="Processing") # Uploaded, Processing, Verified, Needs Review, Rejected
    ocr_confidence = Column(Float, default=0.0) # e.g. 96.0 or 61.0
    extracted_data = Column(Text, default="{}") # JSON of extracted values
    verification_status = Column(String(50), default="Processing")
    verified_by = Column(String(100), nullable=True)
    verification_notes = Column(Text, default="")
    
    user = relationship("User", back_populates="documents")

class Application(Base):
    __tablename__ = "applications"
    
    id = Column(Integer, primary_key=True, index=True)
    application_number = Column(String(100), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    scholarship_id = Column(Integer, ForeignKey("scholarships.id"), nullable=False)
    
    status = Column(String(50), default="Submitted") # Draft, Submitted, Under Verification, Documents Required, Verified, Selected, Not Selected
    current_stage = Column(String(50), default="verify") # discover, understand, apply, verify, track
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    verification_notes = Column(Text, default="Application received. Document verification in progress.")
    
    user = relationship("User", back_populates="applications")
    scholarship = relationship("Scholarship", back_populates="applications")

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False)
    target_type = Column(String(100), nullable=False)
    target_id = Column(String(100), nullable=True)
    details = Column(Text, default="")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
