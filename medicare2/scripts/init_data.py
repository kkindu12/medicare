import asyncio
from datetime import datetime, timedelta
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

async def init_test_data():
    """Initialize test data in the database"""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
        
        # Initialize Beanie
        await init_beanie(
            database=client[os.getenv("DATABASE_NAME", "medicare")],
            document_models=[User, Doctor, Appointment]
        )
        
        # Create test user
        test_user = User(
            email="john.doe@example.com",
            full_name="John Doe",
            hashed_password="hashed_password_here"  # In production, use proper password hashing
        )
        await test_user.insert()
        logger.info("Created test user: John Doe")

        # Create test doctor
        test_doctor = Doctor(
            user=test_user,
            specialty="General Medicine",
            location="New York",
            consultation_fee=150.00,
            experience_years=10,
            education=["MD", "PhD"],
            languages=["English", "Spanish"]
        )
        await test_doctor.insert()
        logger.info("Created test doctor: Dr. Smith")

        # Create test appointment
        test_appointment = Appointment(
            doctor=test_doctor,
            patient=test_user,
            appointment_date=datetime.utcnow() + timedelta(days=1),
            status="pending",
            notes="Initial consultation"
        )
        await test_appointment.insert()
        logger.info("Created test appointment")

        logger.info("Test data initialization completed successfully!")
        
    except Exception as e:
        logger.error(f"Error initializing test data: {str(e)}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(init_test_data()) 