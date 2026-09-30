import httpx
from fastapi import APIRouter
from app.config import settings

router = APIRouter(prefix="/sheets", tags=["Google Sheets Integration"])

@router.get("/status")
async def get_google_sheet_status():
    sheet_id = settings.GOOGLE_SHEET_ID
    sheet_url = settings.GOOGLE_SHEET_URL
    webhook_url = settings.GOOGLE_APPS_SCRIPT_URL
    
    reachable = False
    try:
        async with httpx.AsyncClient(timeout=4.0, follow_redirects=True) as client:
            res = await client.get(sheet_url)
            if res.status_code == 200:
                reachable = True
    except Exception:
        reachable = False

    return {
        "configured": True,
        "sheet_id": sheet_id,
        "sheet_url": sheet_url,
        "destination_sheet_name": settings.GOOGLE_SHEET_NAME,
        "sheet_reachable": reachable,
        "apps_script_webhook_configured": bool(webhook_url),
        "status": "ready" if webhook_url else "configured_awaiting_webhook",
        "integration_mode": "Apps Script Webhook / Service Account Proxy",
        "security_notice": "Server-side integration only. Zero Google API keys or credentials exposed in frontend."
    }
