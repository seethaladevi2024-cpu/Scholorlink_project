import os
import json
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import Document, User, StudentProfile
from app.services.auth import get_current_user
from app.services.ocr_engine import process_document_ocr
from app.config import settings

router = APIRouter(prefix="/documents", tags=["Documents"])

os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_document(
    document_type: str = Form(...),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Read file content
    contents = await file.read()
    file_size = len(contents)
    
    # Save file locally
    ext = os.path.splitext(file.filename)[1] or ".pdf"
    unique_filename = f"{uuid.uuid4().hex[:12]}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as f:
        f.write(contents)
        
    student_profile = {}
    if current_user.profile:
        p = current_user.profile
        student_profile = {
            "name": p.name,
            "can_number": p.can_number,
            "caste": p.caste,
            "community": p.community,
            "annual_income": p.annual_income,
            "marks_percentage": p.marks_percentage
        }
        
    # Process through OCR Engine
    ocr_result = process_document_ocr(
        file_bytes=contents,
        original_filename=file.filename,
        document_type=document_type,
        student_profile=student_profile
    )
    
    # Save Document in Database
    doc = Document(
        user_id=current_user.id,
        document_type=document_type,
        original_filename=file.filename,
        stored_path=file_path,
        file_size=file_size,
        ocr_status=ocr_result["ocr_status"],
        ocr_confidence=ocr_result["ocr_confidence"],
        extracted_data=json.dumps(ocr_result["extracted_data"]),
        verification_status=ocr_result["verification_status"],
        verification_notes=ocr_result["verification_notes"]
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)
    
    return {
        "id": doc.id,
        "user_id": doc.user_id,
        "document_type": doc.document_type,
        "original_filename": doc.original_filename,
        "file_size": doc.file_size,
        "uploaded_at": doc.uploaded_at.strftime("%d %b %Y, %H:%M"),
        "ocr_status": doc.ocr_status,
        "ocr_confidence": doc.ocr_confidence,
        "extracted_data": json.loads(doc.extracted_data),
        "verification_status": doc.verification_status,
        "verification_notes": doc.verification_notes
    }

@router.get("/")
def list_documents(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role in ["ADMIN", "VERIFIER"]:
        docs = db.query(Document).order_by(Document.uploaded_at.desc()).all()
    else:
        docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.uploaded_at.desc()).all()
        
    results = []
    for d in docs:
        extracted = {}
        try:
            extracted = json.loads(d.extracted_data)
        except Exception:
            extracted = {}
        results.append({
            "id": d.id,
            "user_id": d.user_id,
            "document_type": d.document_type,
            "original_filename": d.original_filename,
            "file_size": d.file_size,
            "uploaded_at": d.uploaded_at.strftime("%d %b %Y, %H:%M"),
            "ocr_status": d.ocr_status,
            "ocr_confidence": d.ocr_confidence,
            "extracted_data": extracted,
            "verification_status": d.verification_status,
            "verified_by": d.verified_by,
            "verification_notes": d.verification_notes
        })
    return results

@router.delete("/{document_id}")
def delete_document(document_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
        
    if doc.user_id != current_user.id and current_user.role != "ADMIN":
        raise HTTPException(status_code=403, detail="Not authorized to delete this document.")
        
    if os.path.exists(doc.stored_path):
        try:
            os.remove(doc.stored_path)
        except Exception:
            pass
            
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully."}
