import dropbox
from fastapi import HTTPException, UploadFile
from dotenv import load_dotenv
import os
from services.database import get_db
from bson import ObjectId

load_dotenv()

DROPBOX_ACCESS_TOKEN = os.getenv("DROPBOX_ACCESS_TOKEN")
DROPBOX_REFRESH_TOKEN = os.getenv("DROPBOX_REFRESH_TOKEN")
DROPBOX_APP_KEY = os.getenv("DROPBOX_APP_KEY")
DROPBOX_APP_SECRET = os.getenv("DROPBOX_APP_SECRET")

def get_valid_dropbox_client():
    global DROPBOX_ACCESS_TOKEN
    
    if not DROPBOX_ACCESS_TOKEN:
        return None, {"error": "No access token available"}
    
    try:
        # Try to use current token
        dbx = dropbox.Dropbox(DROPBOX_ACCESS_TOKEN)
        account_info = dbx.users_get_current_account()
        return dbx, None
        
    except dropbox.exceptions.AuthError as auth_error:
        
        # Try to refresh token
        if DROPBOX_REFRESH_TOKEN and DROPBOX_APP_KEY and DROPBOX_APP_SECRET:
            refresh_result = refresh_dropbox_token(DROPBOX_REFRESH_TOKEN)
            
            if refresh_result.get("status") == "success":
                new_token = refresh_result.get("access_token")
                
                # Update environment variable for this session
                os.environ["DROPBOX_ACCESS_TOKEN"] = new_token
                DROPBOX_ACCESS_TOKEN = new_token
                
                # Update .env file automatically
                update_env_file("DROPBOX_ACCESS_TOKEN", new_token)
                
                # Return new client
                return dropbox.Dropbox(new_token), None
            else:
                return None, {"error": "Token refresh failed", "details": refresh_result}
        else:
            return None, {"error": "Token expired and no refresh token available"}
    
    except Exception as e:
        return None, {"error": f"Dropbox client error: {str(e)}"}

def update_env_file(key: str, value: str):
    env_path = ".env"
    
    # Read current .env content
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            lines = f.readlines()
    else:
        lines = []
    
    # Update or add the key
    updated = False
    for i, line in enumerate(lines):
        if line.startswith(f"{key}="):
            lines[i] = f"{key}={value}\n"
            updated = True
            break
    
    if not updated:
        lines.append(f"{key}={value}\n")
    
    # Write back to .env
    with open(env_path, 'w') as f:
        f.writelines(lines)
        

# OAuth2 authorization URL generation
def get_dropbox_auth_url():
    
    if not DROPBOX_APP_KEY:
        return {"error": "DROPBOX_APP_KEY not found in environment variables"}
    
    try:
        import dropbox
        
        # Create OAuth2 flow
        auth_flow = dropbox.DropboxOAuth2FlowNoRedirect(
            DROPBOX_APP_KEY, 
            DROPBOX_APP_SECRET,
            token_access_type='offline'  # This allows for refresh tokens
        )
        
        # Get authorization URL
        authorize_url = auth_flow.start()
        
        return {
            "status": "success",
            "authorize_url": authorize_url,
            "instructions": [
                "1. Copy the URL and open it in your browser",
                "2. Allow access to your Dropbox account", 
                "3. Copy the authorization code from the page",
                "4. Use the code with the /complete-dropbox-auth endpoint"
            ]
        }
    except Exception as e:
        return {"error": f"Failed to generate auth URL: {str(e)}"}

def complete_dropbox_auth(auth_code: str):
    
    if not DROPBOX_APP_KEY or not DROPBOX_APP_SECRET:
        return {"error": "App Key and App Secret required"}
    
    try:
        import dropbox
        
        # Create OAuth2 flow
        auth_flow = dropbox.DropboxOAuth2FlowNoRedirect(
            DROPBOX_APP_KEY, 
            DROPBOX_APP_SECRET,
            token_access_type='offline'
        )
        
        # Complete the flow
        oauth_result = auth_flow.finish(auth_code)
        
        # Extract tokens
        access_token = oauth_result.access_token
        refresh_token = oauth_result.refresh_token
        
        # Automatically update .env file
        update_env_file("DROPBOX_ACCESS_TOKEN", access_token)
        if refresh_token:
            update_env_file("DROPBOX_REFRESH_TOKEN", refresh_token)
        
        # Update global variables for current session
        global DROPBOX_ACCESS_TOKEN, DROPBOX_REFRESH_TOKEN
        DROPBOX_ACCESS_TOKEN = access_token
        DROPBOX_REFRESH_TOKEN = refresh_token
        os.environ["DROPBOX_ACCESS_TOKEN"] = access_token
        if refresh_token:
            os.environ["DROPBOX_REFRESH_TOKEN"] = refresh_token
        
        return {
            "status": "success",
            "message": "Dropbox authentication completed and tokens saved",
            "access_token_preview": f"{access_token[:20]}...",
            "refresh_token_available": bool(refresh_token),
            "auto_refresh_enabled": True
        }
    except Exception as e:
        return {"error": f"Auth completion failed: {str(e)}"}

# Token refresh function using refresh token
def refresh_dropbox_token(refresh_token: str = None):
    
    if not DROPBOX_APP_KEY or not DROPBOX_APP_SECRET:
        return {"error": "App Key and App Secret required for token refresh"}
    
    # Use refresh token from environment if not provided
    if not refresh_token:
        refresh_token = os.getenv("DROPBOX_REFRESH_TOKEN")
    
    if not refresh_token:
        return {"error": "Refresh token not provided and not found in environment"}
    
    try:
        import dropbox
        import requests
        
        # Dropbox token refresh endpoint
        token_url = "https://api.dropboxapi.com/oauth2/token"
        
        data = {
            'grant_type': 'refresh_token',
            'refresh_token': refresh_token,
            'client_id': DROPBOX_APP_KEY,
            'client_secret': DROPBOX_APP_SECRET
        }
        
        response = requests.post(token_url, data=data)
        
        if response.status_code == 200:
            token_data = response.json()
            new_access_token = token_data.get('access_token')
            return {
                "status": "success",
                "access_token": new_access_token,
                "message": "Update your .env file with the new DROPBOX_ACCESS_TOKEN",
                "instructions": [f"DROPBOX_ACCESS_TOKEN={new_access_token}"]
            }
        else:
            return {"error": f"Token refresh failed: {response.text}"}
            
    except Exception as e:
        return {"error": f"Token refresh failed: {str(e)}"}

def upload_file_to_dropbox(recordId: str, file: UploadFile):
    
    # Get valid Dropbox client (auto-refreshes token if needed)
    dbx, error = get_valid_dropbox_client()
    if error:
        return error
    
    try:
        # Create the upload path
        dropbox_path = f"/medicare_uploads/{recordId}/{file.filename}"
        
        # Reset file pointer and upload
        file.file.seek(0)
        file_content = file.file.read()
        
        # Upload to Dropbox
        dbx.files_upload(
            file_content, 
            dropbox_path, 
            mode=dropbox.files.WriteMode.overwrite
        )
        
        
        # Update patient record in MongoDB
        db = get_db()
        update_result = db.patientRecords.update_one(
            {"_id": ObjectId(recordId)},
            {"$push": {"reports": file.filename}}
        )

        if update_result.modified_count == 0:
            return {"error": "Failed to update patient's reports in MongoDB"}

        return {
            "path": dropbox_path,
            "message": "File uploaded successfully"
        }

    except dropbox.exceptions.ApiError as api_error:
        return {"error": f"Dropbox API error: {str(api_error)}"}
    except Exception as e:
        return {"error": str(e)}

def upload_file_to_dropbox_simple(patientRecordId: str, file: UploadFile):
    dbx, error = get_valid_dropbox_client()
    if error:
        return error
    
    try:
        dropbox_path = f"/medicare_uploads/{patientRecordId}/{file.filename}"
        file.file.seek(0)
        file_content = file.file.read()
        
        dbx.files_upload(
            file_content, 
            dropbox_path, 
            mode=dropbox.files.WriteMode.overwrite
        )
        return {
            "path": dropbox_path,
            "message": "File uploaded successfully"
        }

    except dropbox.exceptions.ApiError as api_error:
        return {"error": f"Dropbox API error: {str(api_error)}"}
    except Exception as e:
        return {"error": str(e)}

def test_dropbox_connection():
    
    if not DROPBOX_ACCESS_TOKEN:
        return {"error": "DROPBOX_ACCESS_TOKEN not found in environment variables"}
    
    try:
        dbx = dropbox.Dropbox(DROPBOX_ACCESS_TOKEN)
        account_info = dbx.users_get_current_account()
        
        return {
            "status": "success",
            "message": "Dropbox connection successful",
            "account_email": account_info.email,
            "account_id": account_info.account_id,
            "app_key_available": bool(DROPBOX_APP_KEY),
            "app_secret_available": bool(DROPBOX_APP_SECRET)
        }
    except dropbox.exceptions.AuthError as auth_error:
        if "expired" in str(auth_error).lower():
            return {
                "status": "error",
                "error": "Access token expired",
                "suggestion": "Generate new token from Dropbox console or implement OAuth2 refresh",
                "app_key_available": bool(DROPBOX_APP_KEY),
                "app_secret_available": bool(DROPBOX_APP_SECRET)
            }
        return {
            "status": "error",
            "error": "Authentication failed",
            "details": str(auth_error)
        }
    except Exception as e:
        return {
            "status": "error", 
            "error": "Connection failed",
            "details": str(e)
        }
