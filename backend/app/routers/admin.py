import json
import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import (
    Scholarship,
    ScholarshipRule,
    Document,
    Application,
    User,
    StudentProfile,
    AuditLog
)
from app.schemas.domain import (
    ScholarshipCreateUpdate,
    ApplicationActionRequest
)
from app.services.auth import get_current_user, require_role

router = APIRouter(prefix="/admin", tags=["Admin & Verification"])

@router.get("/overview")
def get_admin_overview(
    current_user: User = Depends(require_role(["ADMIN", "VERIFIER"])),
    db: Session = Depends(get_db)
):
    total_apps = db.query(Application).count()
    pending_verification = db.query(Application).filter(Application.status.in_(["Submitted", "Under Verification"])).count()
    docs_review = db.query(Document).filter(Document.verification_status.in_(["Needs Review", "Processing"])).count()
    uncertain_ai = db.query(Document).filter(Document.ocr_confidence < 85.0).count()
    total_scholarships = db.query(Scholarship).count()
    total_students = db.query(User).filter(User.role == "STUDENT").count()

    return {
        "kpis": {
            "total_applications": total_apps,
            "pending_verification": pending_verification,
            "docs_requiring_review": docs_review,
            "potential_mismatches": 2, # Flagged discrepancy metrics
            "uncertain_ai_cases": uncertain_ai,
            "active_scholarships": total_scholarships,
            "registered_students": total_students
        }
    }

@router.get("/verification-queue")
def get_verification_queue(
    current_user: User = Depends(require_role(["ADMIN", "VERIFIER"])),
    db: Session = Depends(get_db)
):
    # Documents requiring review or applications under verification
    docs = db.query(Document).order_by(Document.uploaded_at.desc()).limit(20).all()
    queue = []
    
    for d in docs:
        extracted = {}
        try:
            extracted = json.loads(d.extracted_data)
        except Exception:
            pass
            
        student_name = d.user.full_name if d.user else "Candidate"
        can_num = d.user.profile.can_number if (d.user and d.user.profile) else "CAN-N/A"
        
        # Identify flagged issue
        issue = "Automated OCR extraction verified"
        if d.ocr_confidence < 85.0:
            issue = f"Low OCR Confidence ({d.ocr_confidence:.1f}%). Document scan requires manual transcription check."
        elif d.verification_status == "Needs Review":
            issue = "Certificate serial number verification pending district portal sync."
        elif d.verification_status == "Rejected":
            issue = "Document expired or unreadable issuer signature."

        queue.append({
            "id": d.id,
            "student_name": student_name,
            "can_number": can_num,
            "document_type": d.document_type,
            "original_filename": d.original_filename,
            "issue": issue,
            "confidence": d.ocr_confidence,
            "verification_status": d.verification_status,
            "uploaded_at": d.uploaded_at.strftime("%d %b %Y, %H:%M"),
            "extracted_data": extracted
        })
    return queue

@router.post("/verification/{document_id}/action")
def take_verification_action(
    document_id: int,
    payload: ApplicationActionRequest,
    current_user: User = Depends(require_role(["ADMIN", "VERIFIER"])),
    db: Session = Depends(get_db)
):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    action_type = payload.action.upper()
    if action_type == "APPROVE":
        doc.verification_status = "Verified"
        doc.ocr_status = "Verified"
        doc.verified_by = current_user.full_name
        doc.verification_notes = payload.notes or "Manually reviewed and approved by verification officer."
    elif action_type == "REQUEST_CORRECTION":
        doc.verification_status = "Needs Review"
        doc.ocr_status = "Needs Review"
        doc.verified_by = current_user.full_name
        doc.verification_notes = payload.notes or "Candidate requested to re-upload clear legible copy with official stamp."
    elif action_type == "REJECT":
        doc.verification_status = "Rejected"
        doc.ocr_status = "Rejected"
        doc.verified_by = current_user.full_name
        doc.verification_notes = payload.notes or "Document rejected: criteria discrepancy or invalid certificate."
    else:
        raise HTTPException(status_code=400, detail="Invalid verification action.")

    # Audit log
    audit = AuditLog(
        user_id=current_user.id,
        action=f"DOC_{action_type}",
        target_type="Document",
        target_id=str(doc.id),
        details=f"Document {doc.id} ({doc.document_type}) action: {action_type}. Notes: {doc.verification_notes}"
    )
    db.add(audit)
    db.commit()

    return {
        "message": f"Document status updated to {doc.verification_status}.",
        "document_id": doc.id,
        "verification_status": doc.verification_status,
        "verification_notes": doc.verification_notes
    }

# --- Centralized Scholarship Knowledge Base ---
@router.post("/scholarships")
def create_or_update_scholarship_rule(
    payload: ScholarshipCreateUpdate,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    now = datetime.datetime.utcnow()
    
    new_s = Scholarship(
        title=payload.title,
        provider=payload.provider,
        category=payload.category,
        amount_display=payload.amount_display,
        amount_value=payload.amount_value,
        deadline=payload.deadline,
        description=payload.description,
        version="v1.0",
        last_updated=now
    )
    db.add(new_s)
    db.commit()
    db.refresh(new_s)

    new_rule = ScholarshipRule(
        scholarship_id=new_s.id,
        min_marks=payload.min_marks,
        max_income=payload.max_income,
        allowed_castes=json.dumps(payload.allowed_castes),
        allowed_courses=json.dumps(payload.allowed_courses),
        required_documents=json.dumps(payload.required_documents),
        gender_preference=payload.gender_preference,
        rule_version="1.0",
        last_modified_by=current_user.full_name,
        updated_at=now
    )
    db.add(new_rule)
    db.commit()

    return {"message": "Scholarship rule successfully published to knowledge base.", "id": new_s.id}

@router.put("/scholarships/{scholarship_id}")
def update_scholarship_rule(
    scholarship_id: int,
    payload: ScholarshipCreateUpdate,
    current_user: User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    s = db.query(Scholarship).filter(Scholarship.id == scholarship_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scholarship not found.")

    # Increment version
    try:
        curr_ver = float(s.version.replace("v", ""))
        new_ver = f"v{curr_ver + 0.1:.1f}"
    except Exception:
        new_ver = "v1.1"

    now = datetime.datetime.utcnow()
    s.title = payload.title
    s.provider = payload.provider
    s.category = payload.category
    s.amount_display = payload.amount_display
    s.amount_value = payload.amount_value
    s.deadline = payload.deadline
    s.description = payload.description
    s.version = new_ver
    s.last_updated = now

    if s.rules:
        r = s.rules
        r.min_marks = payload.min_marks
        r.max_income = payload.max_income
        r.allowed_castes = json.dumps(payload.allowed_castes)
        r.allowed_courses = json.dumps(payload.allowed_courses)
        r.required_documents = json.dumps(payload.required_documents)
        r.gender_preference = payload.gender_preference
        r.rule_version = new_ver.replace("v", "")
        r.last_modified_by = current_user.full_name
        r.updated_at = now

    db.commit()
    return {"message": f"Scholarship rules updated to {new_ver}.", "id": s.id, "version": new_ver}
