from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routers import user, doctor, appointment
from database import init_db, close_db_connection
import logging
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="Medicare API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store the MongoDB client
mongo_client = None

@app.on_event("startup")
async def startup_event():
    """Initialize database connection on startup"""
    global mongo_client
    try:
        mongo_client = await init_db()
        logger.info("Application startup complete")
    except Exception as e:
        logger.error(f"Failed to start application: {str(e)}")
        raise

@app.on_event("shutdown")
async def shutdown_event():
    """Close database connection on shutdown"""
    if mongo_client:
        await close_db_connection(mongo_client)
        logger.info("Application shutdown complete")

# Include routers
app.include_router(user.router, prefix="/api", tags=["users"])
app.include_router(doctor.router, prefix="/api", tags=["doctors"])
app.include_router(appointment.router, prefix="/api", tags=["appointments"])

@app.get("/")
async def root():
    """Root endpoint to verify API is running"""
    return {
        "message": "Welcome to Medicare API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint to verify MongoDB connection"""
    try:
        if not mongo_client:
            raise HTTPException(
                status_code=503,
                detail="MongoDB client not initialized"
            )
        
        # Test connection
        await mongo_client.admin.command('ping')
        
        # Get database info
        db_name = os.getenv("DATABASE_NAME", "medicare")
        db = mongo_client[db_name]
        collections = await db.list_collection_names()
        
        return {
            "status": "healthy",
            "database": {
                "name": db_name,
                "collections": collections,
                "connected": True
            },
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=503,
            detail=f"Database connection failed: {str(e)}"
        )