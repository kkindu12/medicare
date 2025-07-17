import os
from typing import List

class Settings:
    # API Configuration
    APP_NAME: str = "Medicare API"
    APP_VERSION: str = "1.0.0"
    APP_DESCRIPTION: str = "Pharmacy & Laboratory Management System"
    
    # CORS Configuration
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:4200",  # Angular dev server
        "http://localhost:3000",  # Alternative frontend port
        "http://127.0.0.1:4200",
        "http://127.0.0.1:3000"
    ]
    
    # File Upload Configuration
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    ALLOWED_FILE_TYPES: List[str] = [
        "application/pdf",
        "image/jpeg",
        "image/jpg", 
        "image/png",
        "image/gif"
    ]
    
    # Upload Directories
    REFERRAL_UPLOAD_DIR: str = "uploads/referrals"
    PRESCRIPTION_UPLOAD_DIR: str = "uploads/prescriptions"
    
    # Stock Thresholds
    LOW_STOCK_THRESHOLD: int = 10
    
    # Database Configuration (for future use)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./medicare.db")
    
    # Security Configuration (for future use)
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

settings = Settings()
