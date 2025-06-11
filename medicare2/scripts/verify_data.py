import asyncio
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

async def verify_test_data():
    """Verify test data in the database"""
    try:
        # Connect to MongoDB
        client = AsyncIOMotorClient(os.getenv("MONGODB_URL"))
        
        # Initialize Beanie
        await init_beanie(
            database=client[os.getenv("DATABASE_NAME", "medicare")],
            document_models=[User, Doctor, Appointment]
        )
        
        # Verify users
        users = await User.find().to_list()
        logger.info(f"Found {len(users)} users:")
        for user in users:
            logger.info(f"- {user.full_name} ({user.email})")

        # Verify doctors
        doctors = await Doctor.find().to_list()
        logger.info(f"\nFound {len(doctors)} doctors:")
        for doctor in doctors:
            logger.info(f"- {doctor.user.full_name} ({doctor.specialty})")

        # Verify appointments
        appointments = await Appointment.find().to_list()
        logger.info(f"\nFound {len(appointments)} appointments:")
        for appointment in appointments:
            logger.info(
                f"- Appointment on {appointment.appointment_date} "
                f"between {appointment.patient.full_name} and "
                f"{appointment.doctor.user.full_name} "
                f"(Status: {appointment.status})"
            )

    except Exception as e:
        logger.error(f"Error verifying test data: {str(e)}")
        raise
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(verify_test_data()) 