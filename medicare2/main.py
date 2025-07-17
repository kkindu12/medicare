from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.patient import router as patient_router
from routers.user import router as user_router
from routers.appointment import router as appointment_router
from routers.patientRecord import router as patientRecord_router
from routers.medicine import router as medicine_router
from routers.labTest import router as labTest_router
from routers.notification import router as notification_router
from routers.sse import router as sse_router
import uvicorn

app = FastAPI(title="Medicare EMR API")
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
app.include_router(patient_router, prefix="/api")
app.include_router(patientRecord_router, prefix="/api")
app.include_router(user_router, prefix="/api")
app.include_router(appointment_router, prefix="/api")
app.include_router(medicine_router, prefix="/api")
app.include_router(labTest_router, prefix="/api")
app.include_router(notification_router, prefix="/api/notifications")
app.include_router(sse_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
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