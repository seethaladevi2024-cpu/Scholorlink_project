import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Scholarship, ScholarshipRule, User, StudentProfile, Document
from app.services.auth import get_current_user
from app.services.eligibility_engine import evaluate_eligibility

router = APIRouter(prefix="/scholarships", tags=["Scholarships"])

@router.get("/")
def list_scholarships(
    category: Optional[str] = None,
    search: Optional[str] = None,
    min_match: Optional[int] = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Scholarship).filter(Scholarship.is_active == True)
    
    if category and category != "ALL":
        query = query.filter(Scholarship.category.ilike(f"%{category}%"))
    if search:
        query = query.filter(
            (Scholarship.title.ilike(f"%{search}%")) |
            (Scholarship.provider.ilike(f"%{search}%")) |
            (Scholarship.description.ilike(f"%{search}%"))
        )
        
    scholarships = query.all()
    
    # Get student profile for matching
    student_profile = {}
    if current_user and current_user.profile:
        p = current_user.profile
        student_profile = {
            "name": p.name,
            "caste": p.caste,
            "community": p.community,
            "annual_income": p.annual_income,
            "marks_percentage": p.marks_percentage,
            "current_course": p.current_course
        }
    else:
        # Default sample student profile
        student_profile = {
            "name": "Candidate",
            "caste": "OBC",
            "community": "Backward Community",
            "annual_income": 180000.0,
            "marks_percentage": 84.5,
            "current_course": "Undergraduate Degree"
        }
        
    # Get verified docs for this user
    verified_docs = []
    if current_user:
        docs = db.query(Document).filter(
            Document.user_id == current_user.id,
            Document.verification_status == "Verified"
        ).all()
        verified_docs = [d.document_type for d in docs]
        
    results = []
    for s in scholarships:
        rules_dict = {}
        if s.rules:
            r = s.rules
            allowed_c = r.allowed_castes
            try:
                allowed_c = json.loads(allowed_c) if isinstance(allowed_c, str) else allowed_c
            except Exception:
                allowed_c = ["ALL"]
            allowed_cr = r.allowed_courses
            try:
                allowed_cr = json.loads(allowed_cr) if isinstance(allowed_cr, str) else allowed_cr
            except Exception:
                allowed_cr = ["ALL"]
            req_d = r.required_documents
            try:
                req_d = json.loads(req_d) if isinstance(req_d, str) else req_d
            except Exception:
                req_d = []
                
            rules_dict = {
                "min_marks": r.min_marks,
                "max_income": r.max_income,
                "allowed_castes": allowed_c,
                "allowed_courses": allowed_cr,
                "required_documents": req_d,
                "gender_preference": r.gender_preference
            }
            
        eval_result = evaluate_eligibility(student_profile, rules_dict, verified_docs)
        
        if eval_result["match_percentage"] >= min_match:
            results.append({
                "id": s.id,
                "title": s.title,
                "provider": s.provider,
                "category": s.category,
                "amount_display": s.amount_display,
                "amount_value": s.amount_value,
                "deadline": s.deadline,
                "description": s.description,
                "application_url": s.application_url,
                "is_active": s.is_active,
                "version": s.version,
                "last_updated": s.last_updated.strftime("%d %b %Y"),
                "match_percentage": eval_result["match_percentage"],
                "eligibility_status": eval_result["eligibility_status"],
                "why_you_match": eval_result["why_you_match"],
                "missing_info": eval_result["missing_info"],
                "disclaimer": eval_result["disclaimer"],
                "rules": rules_dict
            })
            
    # Sort by match percentage descending
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results

@router.get("/{scholarship_id}")
def get_scholarship_detail(
    scholarship_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    s = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scholarship not found.")
        
    student_profile = {}
    if current_user and current_user.profile:
        p = current_user.profile
        student_profile = {
            "name": p.name,
            "caste": p.caste,
            "community": p.community,
            "annual_income": p.annual_income,
            "marks_percentage": p.marks_percentage,
            "current_course": p.current_course
        }
    else:
        student_profile = {
            "name": "Candidate",
            "caste": "OBC",
            "community": "Backward Community",
            "annual_income": 180000.0,
            "marks_percentage": 84.5,
            "current_course": "Undergraduate Degree"
        }
        
    verified_docs = []
    if current_user:
        docs = db.query(Document).filter(
            Document.user_id == current_user.id,
            Document.verification_status == "Verified"
        ).all()
        verified_docs = [d.document_type for d in docs]

    rules_dict = {}
    if s.rules:
        r = s.rules
        allowed_c = r.allowed_castes
        try:
            allowed_c = json.loads(allowed_c) if isinstance(allowed_c, str) else allowed_c
        except Exception:
            allowed_c = ["ALL"]
        allowed_cr = r.allowed_courses
        try:
            allowed_cr = json.loads(allowed_cr) if isinstance(allowed_cr, str) else allowed_cr
        except Exception:
            allowed_cr = ["ALL"]
        req_d = r.required_documents
        try:
            req_d = json.loads(req_d) if isinstance(req_d, str) else req_d
        except Exception:
            req_d = []
            
        rules_dict = {
            "min_marks": r.min_marks,
            "max_income": r.max_income,
            "allowed_castes": allowed_c,
            "allowed_courses": allowed_cr,
            "required_documents": req_d,
            "gender_preference": r.gender_preference
        }

    eval_result = evaluate_eligibility(student_profile, rules_dict, verified_docs)

    return {
        "id": s.id,
        "title": s.title,
        "provider": s.provider,
        "category": s.category,
        "amount_display": s.amount_display,
        "amount_value": s.amount_value,
        "deadline": s.deadline,
        "description": s.description,
        "application_url": s.application_url,
        "is_active": s.is_active,
        "version": s.version,
        "last_updated": s.last_updated.strftime("%d %b %Y"),
        "match_percentage": eval_result["match_percentage"],
        "eligibility_status": eval_result["eligibility_status"],
        "why_you_match": eval_result["why_you_match"],
        "missing_info": eval_result["missing_info"],
        "disclaimer": eval_result["disclaimer"],
        "rules": rules_dict,
        "faqs": [
            {
                "question": "Can I apply if my official income certificate is still being processed?",
                "answer": "Yes, you may submit a preliminary application. However, final disbursal requires an authorized income certificate verified via the ScholarLink OCR validation system."
            },
            {
                "question": "Is there an age limit for this scholarship?",
                "answer": "Standard age criteria conform to national higher education admission norms (typically 17-25 years for undergraduate programs)."
            },
            {
                "question": "How are scholarship funds disbursed?",
                "answer": "Benefits are disbursed directly into the student's validated Aadhaar-seeded bank account through the Direct Benefit Transfer (DBT) mechanism."
            }
        ]
    }
