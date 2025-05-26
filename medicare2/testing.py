from pymongo import MongoClient
import certifi

MONGODB_URI = "mongodb+srv://kaveeshashaminda01:E92RwdciHLwhTjvp@aisacluster.pfqkjtv.mongodb.net/?retryWrites=true&w=majority&appName=AisaCluster"

try:
    client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
    client.admin.command("ping")
    print("✅ Connection OK")
except Exception as e:
    print("❌ Connection failed:", e)
