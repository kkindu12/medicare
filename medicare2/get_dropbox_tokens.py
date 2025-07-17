"""
Dropbox Token Generator Script
This script helps you generate new Dropbox access and refresh tokens for your application.
Run this script and follow the instructions to get new tokens for your .env file.
"""

import dropbox
from dropbox import DropboxOAuth2FlowNoRedirect
import os
import requests
from dotenv import load_dotenv, set_key

# Load environment variables
load_dotenv()

# Your app credentials from .env file
APP_KEY = os.getenv("DROPBOX_APP_KEY", "g8b73lyerjwksih")
APP_SECRET = os.getenv("DROPBOX_APP_SECRET", "mt4a61kj3ybnf7g")

def get_new_dropbox_tokens():
    """Generate new Dropbox access and refresh tokens using OAuth2 flow"""
    
    if not APP_KEY or not APP_SECRET:
        return None
    
    try:
        # Create OAuth2 flow
        auth_flow = DropboxOAuth2FlowNoRedirect(
            APP_KEY, 
            APP_SECRET,
            token_access_type='offline'  # This ensures we get a refresh token
        )
          # Get authorization URL
        authorize_url = auth_flow.start()
        
        # Get authorization code from user
        auth_code = input("Authorization code: ").strip()
        if not auth_code:
            return None
        
        # Complete the authorization flow
        oauth_result = auth_flow.finish(auth_code)
        access_token = oauth_result.access_token
        refresh_token = oauth_result.refresh_token
        
        # Test the new tokens
        dbx = dropbox.Dropbox(access_token)
        account_info = dbx.users_get_current_account()
          # Update .env file automatically
        update_env_file(access_token, refresh_token)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token        }
        
    except Exception as e:
        return None

def update_env_file(access_token, refresh_token):
    """Update the .env file with new tokens"""
    try:
        env_file_path = ".env"
        
        # Update or add the tokens to .env file
        set_key(env_file_path, 'DROPBOX_ACCESS_TOKEN', access_token)
        set_key(env_file_path, 'DROPBOX_REFRESH_TOKEN', refresh_token)
        
    except Exception as e:
        pass

def simple_token_generation():
    """Alternative method using direct API calls"""
    
    auth_url = f"https://www.dropbox.com/oauth2/authorize?client_id={APP_KEY}&token_access_type=offline&response_type=code"
    
    auth_code = input("Authorization code: ").strip()
    if not auth_code:
        return None
    
    # Make the token request
    token_url = "https://api.dropboxapi.com/oauth2/token"
    data = {
        'code': auth_code,
        'grant_type': 'authorization_code',
        'client_id': APP_KEY,
        'client_secret': APP_SECRET
    }
    
    try:
        response = requests.post(token_url, data=data)
        response.raise_for_status()
        
        tokens = response.json()
        access_token = tokens['access_token']
        refresh_token = tokens['refresh_token']
        
        # Test the token
        test_response = requests.post(
            'https://api.dropboxapi.com/2/users/get_current_account',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        test_response.raise_for_status()
        user_info = test_response.json()
        
        # Update .env file
        update_env_file(access_token, refresh_token)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token        }
        
    except Exception as e:
        if hasattr(e, 'response'):
            pass
        return None

if __name__ == "__main__":
    try:
        choice = input("\nEnter your choice (1 or 2): ").strip()
        
        if choice == "1":
            tokens = get_new_dropbox_tokens()
        elif choice == "2":
            tokens = simple_token_generation()
        else:
            tokens = get_new_dropbox_tokens()
        
        if tokens:
            pass
        else:
            pass
            
    except KeyboardInterrupt:
        pass
    except Exception as e:
        pass