import dropbox
from fastapi import HTTPException, UploadFile
from dotenv import load_dotenv
import os
from services.database import get_db
from bson import ObjectId

load_dotenv()
db = get_db()  # from your Mongo connection code
patients_collection = db["patients"]

DROPBOX_ACCESS_TOKEN = os.getenv("DROPBOX_ACCESS_TOKEN")

def upload_file_to_dropbox(file: UploadFile):
    patient_id = "6832d0ebd89bf02eda9a06dd"
    try:
        dbx = dropbox.Dropbox(DROPBOX_ACCESS_TOKEN)
        
        dropbox_path = f"/medicare_uploads/{patient_id}/{file.filename}"
        file.file.seek(0)
        dbx.files_upload(file.file.read(), dropbox_path, mode=dropbox.files.WriteMode.overwrite)

        update_result = patients_collection.update_one(
            {"_id": ObjectId(patient_id)},
            {"$push": {"reports": file.filename}}
        )

        if update_result.modified_count == 0:
            return {"error": "Failed to update patient's reports in MongoDB"}

        return {
            "path": dropbox_path
        }

    except Exception as e:
        return {
            "error": str(e)
        }
