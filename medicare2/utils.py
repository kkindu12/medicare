import os
import uuid
from typing import Optional
from fastapi import HTTPException, UploadFile
from config import settings

def validate_file(file: UploadFile, max_size: Optional[int] = None) -> bytes:
    """
    Validate uploaded file for size and type
    Returns file content as bytes if valid
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file uploaded")
    
    # Read file content
    content = file.file.read()
    file.file.seek(0)  # Reset file pointer
    
    # Check file size
    max_file_size = max_size or settings.MAX_FILE_SIZE
    if len(content) > max_file_size:
        raise HTTPException(
            status_code=400, 
            detail=f"File size must be less than {max_file_size // (1024*1024)}MB"
        )
    
    # Check file type
    if file.content_type not in settings.ALLOWED_FILE_TYPES:
        allowed_extensions = ", ".join([
            ext.split("/")[-1].upper() for ext in settings.ALLOWED_FILE_TYPES
        ])
        raise HTTPException(
            status_code=400, 
            detail=f"Please select a valid file format ({allowed_extensions})"
        )
    
    return content

def generate_filename(prefix: str, original_filename: str) -> str:
    """
    Generate a unique filename with prefix
    """
    file_extension = os.path.splitext(original_filename)[1]
    unique_id = str(uuid.uuid4())
    return f"{prefix}_{unique_id}{file_extension}"

def ensure_upload_dirs():
    """
    Ensure upload directories exist
    """
    os.makedirs(settings.REFERRAL_UPLOAD_DIR, exist_ok=True)
    os.makedirs(settings.PRESCRIPTION_UPLOAD_DIR, exist_ok=True)

def format_file_size(size_bytes: int) -> str:
    """
    Format file size in human readable format
    """
    if size_bytes == 0:
        return "0 Bytes"
    
    size_names = ["Bytes", "KB", "MB", "GB"]
    i = 0
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.2f} {size_names[i]}"

def filter_items(items: list, query: str = None, filters: dict = None) -> list:
    """
    Generic function to filter items based on query and filters
    """
    filtered_items = items.copy()
    
    # Apply text search query
    if query:
        query = query.lower()
        filtered_items = [
            item for item in filtered_items
            if any(
                query in str(value).lower() 
                for key, value in item.items() 
                if isinstance(value, str)
            )
        ]
    
    # Apply filters
    if filters:
        for filter_key, filter_value in filters.items():
            if filter_value:
                filtered_items = [
                    item for item in filtered_items
                    if filter_value.lower() in str(item.get(filter_key, "")).lower()
                ]
    
    return filtered_items
