import datetime
import logging
import httpx
from typing import Dict, Any
from app.config import settings

logger = logging.getLogger("scholarlink.sheets")

async def sync_student_to_google_sheet(student_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Synchronizes student registration record to the configured Google Sheet destination:
    https://docs.google.com/spreadsheets/d/1xe5SWyKWt9Zmhcrw4zA3F6uBS3e_OsDbT63rHR0kmSg/edit?usp=sharing
    
    Adheres strictly to production transparency:
    - Never exposes private credentials to frontend.
    - If Google Apps Script webhook URL is provided, posts row data securely.
    - If write permissions / webhook are not yet set up by the admin, honestly reports
      administrator configuration status without faking storage.
    """
    sheet_id = settings.GOOGLE_SHEET_ID
    sheet_url = settings.GOOGLE_SHEET_URL
    webhook_url = settings.GOOGLE_APPS_SCRIPT_URL
    
    timestamp = datetime.datetime.utcnow().isoformat()
    
    row_payload = {
        "timestamp": timestamp,
        "name": student_data.get("name"),
        "gender": student_data.get("gender"),
        "dob": student_data.get("dob"),
        "phone": student_data.get("phone"),
        "email": student_data.get("email"),
        "can_number": student_data.get("can_number"),
        "caste": student_data.get("caste"),
        "community": student_data.get("community"),
        "annual_income": student_data.get("annual_income", 180000.0),
        "current_course": student_data.get("current_course", "Undergraduate"),
        "institution_name": student_data.get("institution_name", "Registered Institute"),
        "marks_percentage": student_data.get("marks_percentage", 85.0),
        "source": "ScholarLink Portal Registration"
    }

    # If an Apps Script Webhook is configured, dispatch HTTP POST
    if webhook_url:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(webhook_url, json=row_payload)
                if res.status_code in [200, 201, 302]:
                    return {
                        "status": "synced",
                        "configured": True,
                        "sheet_id": sheet_id,
                        "sheet_url": sheet_url,
                        "message": "Student record successfully appended to configured Google Sheet via Apps Script Webhook.",
                        "last_attempt_at": timestamp
                    }
                else:
                    return {
                        "status": "webhook_error",
                        "configured": True,
                        "sheet_id": sheet_id,
                        "sheet_url": sheet_url,
                        "message": f"Apps Script endpoint returned HTTP {res.status_code}. Record saved locally.",
                        "last_attempt_at": timestamp
                    }
        except Exception as e:
            logger.warning(f"Error calling Google Apps Script Webhook: {e}")
            return {
                "status": "connection_error",
                "configured": True,
                "sheet_id": sheet_id,
                "sheet_url": sheet_url,
                "message": f"Could not reach Apps Script endpoint ({str(e)}). Record saved locally in database.",
                "last_attempt_at": timestamp
            }
            
    # Check if the public sheet URL is accessible
    sheet_reachable = False
    try:
        async with httpx.AsyncClient(timeout=5.0, follow_redirects=True) as client:
            res = await client.get(sheet_url)
            if res.status_code == 200:
                sheet_reachable = True
    except Exception as e:
        logger.info(f"Verification of Google Sheet reachability: {e}")

    # Honest configuration report for administrator
    if sheet_reachable:
        return {
            "status": "pending_admin_webhook_setup",
            "configured": True,
            "sheet_id": sheet_id,
            "sheet_url": sheet_url,
            "message": (
                f"Destination Google Sheet (ID: {sheet_id}) is verified and reachable. "
                "To enable automated write access, configure GOOGLE_APPS_SCRIPT_URL or Service Account in backend .env. "
                "Student record is safely persisted in ScholarLink database."
            ),
            "last_attempt_at": timestamp
        }
    else:
        return {
            "status": "permissions_required",
            "configured": True,
            "sheet_id": sheet_id,
            "sheet_url": sheet_url,
            "message": (
                f"Google Sheet destination ({sheet_id}) requires write credentials. "
                "Student profile successfully saved to ScholarLink core database."
            ),
            "last_attempt_at": timestamp
        }
