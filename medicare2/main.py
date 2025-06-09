from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

# Import configuration and utilities
from config import settings
from utils import ensure_upload_dirs

# Import routers
from routers import laboratory, pharmacy

# Initialize FastAPI app with configuration
app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(laboratory.router, prefix="/api/laboratory", tags=["Laboratory"])
app.include_router(pharmacy.router, prefix="/api/pharmacy", tags=["Pharmacy"])

# Ensure upload directories exist
ensure_upload_dirs()

@app.get("/")
async def root():
    return {
        "message": "Medicare API - Pharmacy & Laboratory Management System",
        "version": "1.0.0",
        "endpoints": {
            "laboratory": "/api/laboratory",
            "pharmacy": "/api/pharmacy"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}