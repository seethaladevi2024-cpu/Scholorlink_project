import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "ScholarLink"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "scholarlink-secure-prod-key-92837482910")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./scholarlink.db")
    
    # Google Sheets Integration
    GOOGLE_SHEET_ID: str = os.getenv("GOOGLE_SHEET_ID", "1xe5SWyKWt9Zmhcrw4zA3F6uBS3e_OsDbT63rHR0kmSg")
    GOOGLE_SHEET_NAME: str = os.getenv("GOOGLE_SHEET_NAME", "Student_Registrations")
    GOOGLE_SHEET_URL: str = os.getenv(
        "GOOGLE_SHEET_URL", 
        "https://docs.google.com/spreadsheets/d/1xe5SWyKWt9Zmhcrw4zA3F6uBS3e_OsDbT63rHR0kmSg/edit?usp=sharing"
    )
    GOOGLE_APPS_SCRIPT_URL: str = os.getenv("GOOGLE_APPS_SCRIPT_URL", "")
    GOOGLE_SERVICE_ACCOUNT_FILE: str = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "")
    
    # Uploads
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    
    # Allowed CORS
    CORS_ORIGINS: list = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000"
    ]

settings = Settings()
