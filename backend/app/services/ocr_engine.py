import random
import re
from typing import Dict, Any

def process_document_ocr(
    file_bytes: bytes,
    original_filename: str,
    document_type: str,
    student_profile: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Simulates production OCR Document Text & Field Extraction pipeline.
    
    Extracts key fields, verifies beneficiary name congruence against student profile,
    computes confidence score, and determines initial verification status:
    - Confidence >= 85%: Verified
    - Confidence < 85%: Needs Review (routed to Admin/Verifier queue)
    """
    student_name = student_profile.get("name", "Student")
    can_number = student_profile.get("can_number", "CAN-000000")
    
    # Plausible extraction fields based on document category
    extracted = {
        "document_category": document_type,
        "beneficiary_name": student_name,
        "document_serial_no": f"GOV/{random.randint(1000, 9999)}/{random.randint(2023, 2026)}",
        "issuing_authority": "Competent Revenue & District Authority",
        "issue_date": f"{random.randint(10, 28):02d}-0{random.randint(1, 9)}-2025",
        "digital_signature_detected": True,
        "qr_code_verified": True
    }
    
    # Depending on document type, add domain-specific extracted metrics
    lower_type = document_type.lower()
    
    # For demo reliability with realism, allow simulated variance:
    # Most documents achieve high confidence (e.g., 94-98%), while certain files can trigger human review
    if "income" in lower_type:
        extracted["annual_income_certified"] = f"₹{student_profile.get('annual_income', 180000.0):,.0f}"
        extracted["tehsildar_seal"] = "Valid Digital Hash verified"
        confidence = 96.4
    elif "caste" in lower_type or "community" in lower_type:
        extracted["community_subcaste"] = student_profile.get("community", "General")
        extracted["caste_category"] = student_profile.get("caste", "General")
        confidence = 94.8
    elif "academic" in lower_type or "marksheet" in lower_type:
        extracted["examination_board"] = "State Board of Technical Education"
        extracted["percentage_marks"] = f"{student_profile.get('marks_percentage', 84.5):.1f}%"
        confidence = 91.2
    elif "identity" in lower_type or "aadhaar" in lower_type:
        extracted["id_type"] = "Government Identity Document"
        extracted["mask_verified"] = "XXXX-XXXX-4921"
        confidence = 98.2
    else:
        extracted["notes"] = "General document format verified"
        # Occasionally simulate a low confidence scan (e.g. 61.5%) if filename contains 'scan' or 'unclear'
        if "unclear" in original_filename.lower() or "scan" in original_filename.lower():
            confidence = 61.5
        else:
            confidence = 88.0

    if confidence >= 85.0:
        ocr_status = "Verified"
        verification_status = "Verified"
        verification_notes = f"Automatic verification passed. OCR Confidence {confidence:.1f}% meets safety threshold."
    else:
        ocr_status = "Needs Review"
        verification_status = "Needs Review"
        verification_notes = f"Confidence score ({confidence:.1f}%) is below automated threshold. Escalated to human verification queue."

    return {
        "ocr_status": ocr_status,
        "ocr_confidence": confidence,
        "extracted_data": extracted,
        "verification_status": verification_status,
        "verification_notes": verification_notes
    }
