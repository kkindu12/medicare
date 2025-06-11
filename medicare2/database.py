from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from models.user import User
from models.doctor import Doctor
from models.appointment import Appointment
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# MongoDB configuration
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "medicare")

async def init_db():
    """Initialize database connection and verify it"""
    try:
        # Create Motor client
        client = AsyncIOMotorClient(MONGODB_URL)
        
        # Verify connection
        await client.admin.command('ping')
        logger.info("Successfully connected to MongoDB!")
        
        # Initialize Beanie with the document models
        await init_beanie(
            database=client[DATABASE_NAME],
            document_models=[
                User,
                Doctor,
                Appointment
            ]
        )
        logger.info(f"Initialized Beanie with database: {DATABASE_NAME}")
        
        return client
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise

async def close_db_connection(client):
    """Close database connection"""
    try:
        client.close()
        logger.info("Successfully closed MongoDB connection")
    except Exception as e:
        logger.error(f"Error closing MongoDB connection: {str(e)}")
        raise 