import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
import logging
import sys
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

async def test_connection():
    """Test MongoDB connection and database access"""
    client = None
    try:
        # Get MongoDB URL from environment
        mongodb_url = os.getenv("MONGODB_URL")
        if not mongodb_url:
            raise ValueError("MONGODB_URL environment variable is not set")

        logger.info("Attempting to connect to MongoDB...")
        logger.info(f"Connection URL: {mongodb_url}")

        # Create Motor client
        client = AsyncIOMotorClient(mongodb_url)
        
        # Test connection with ping
        await client.admin.command('ping')
        logger.info("✅ Successfully connected to MongoDB!")
        
        # Get database name
        db_name = os.getenv("DATABASE_NAME", "medicare")
        db = client[db_name]
        
        # Test database access
        collections = await db.list_collection_names()
        logger.info(f"✅ Successfully accessed database: {db_name}")
        logger.info(f"Available collections: {', '.join(collections) if collections else 'None'}")
        
        # Test write access
        test_collection = db.test_connection
        test_doc = {
            "test": "connection",
            "timestamp": datetime.utcnow()
        }
        await test_collection.insert_one(test_doc)
        logger.info("✅ Successfully wrote to database")
        
        # Test read access
        result = await test_collection.find_one({"test": "connection"})
        if result:
            logger.info("✅ Successfully read from database")
        
        # Clean up test document
        await test_collection.delete_one({"test": "connection"})
        logger.info("✅ Successfully cleaned up test data")
        
        return True

    except Exception as e:
        logger.error(f"❌ Connection test failed: {str(e)}")
        return False
    finally:
        if client:
            client.close()
            logger.info("Connection closed")

if __name__ == "__main__":
    success = asyncio.run(test_connection())
    sys.exit(0 if success else 1) 