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
    
    print("🔑 Dropbox Token Generator")
    print("=" * 50)
    print(f"App Key: {APP_KEY}")
    print(f"App Secret: {APP_SECRET[:10]}...")
    print()
    
    if not APP_KEY or not APP_SECRET:
        print("❌ Error: DROPBOX_APP_KEY and DROPBOX_APP_SECRET must be set in .env file")
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
        
        print("📋 STEP 1: Go to this URL in your browser:")
        print(f"   {authorize_url}")
        print()
        print("📋 STEP 2: Click 'Allow' to authorize the app")
        print()
        print("📋 STEP 3: Copy the authorization code and paste it here:")
        
        # Get authorization code from user
        auth_code = input("Authorization code: ").strip()
        
        if not auth_code:
            print("❌ No authorization code provided")
            return None
        
        print("\n🔄 Processing authorization code...")
        
        # Complete the authorization flow
        oauth_result = auth_flow.finish(auth_code)
        
        access_token = oauth_result.access_token
        refresh_token = oauth_result.refresh_token
        
        print("\n✅ SUCCESS! New tokens generated:")
        print("=" * 60)
        print(f"ACCESS_TOKEN: {access_token}")
        print(f"REFRESH_TOKEN: {refresh_token}")
        print("=" * 60)
        
        # Test the new tokens
        print("\n🧪 Testing new access token...")
        dbx = dropbox.Dropbox(access_token)
        account_info = dbx.users_get_current_account()
        print(f"✅ Token works! Connected as: {account_info.name.display_name} ({account_info.email})")
        
        # Update .env file automatically
        update_env_file(access_token, refresh_token)
        
        print("\n📝 Copy these values to your .env file if auto-update didn't work:")
        print("=" * 60)
        print(f"DROPBOX_ACCESS_TOKEN={access_token}")
        print(f"DROPBOX_REFRESH_TOKEN={refresh_token}")
        print("=" * 60)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
        
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return None

def update_env_file(access_token, refresh_token):
    """Update the .env file with new tokens"""
    try:
        env_file_path = ".env"
        
        print(f"\n💾 Updating {env_file_path} with new tokens...")
        
        # Update or add the tokens to .env file
        set_key(env_file_path, 'DROPBOX_ACCESS_TOKEN', access_token)
        set_key(env_file_path, 'DROPBOX_REFRESH_TOKEN', refresh_token)
        
        print("✅ .env file updated successfully!")
        
    except Exception as e:
        print(f"⚠️ Could not update .env file automatically: {str(e)}")
        print("Please update the .env file manually with the tokens shown above.")

def simple_token_generation():
    """Alternative method using direct API calls"""
    
    print("\n🔄 Alternative Method: Direct API Token Generation")
    print("=" * 50)
    
    print("📋 STEP 1: Go to this URL:")
    auth_url = f"https://www.dropbox.com/oauth2/authorize?client_id={APP_KEY}&token_access_type=offline&response_type=code"
    print(f"   {auth_url}")
    print()
    
    print("📋 STEP 2: Click 'Allow' and copy the authorization code")
    auth_code = input("Authorization code: ").strip()
    
    if not auth_code:
        print("❌ No authorization code provided")
        return None
    
    print("\n🔄 Getting your tokens...")
    
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
        
        print("\n✅ SUCCESS! Here are your new tokens:")
        print("=" * 60)
        print(f"ACCESS_TOKEN: {access_token}")
        print(f"REFRESH_TOKEN: {refresh_token}")
        print("=" * 60)
        
        # Test the token
        print("\n🧪 Testing new access token...")
        test_response = requests.post(
            'https://api.dropboxapi.com/2/users/get_current_account',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        test_response.raise_for_status()
        user_info = test_response.json()
        print(f"✅ Token works! Connected as: {user_info['name']['display_name']}")
        
        # Update .env file
        update_env_file(access_token, refresh_token)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token
        }
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        if hasattr(e, 'response'):
            print(f"Response: {e.response.text}")
        return None

if __name__ == "__main__":
    print("🚀 Dropbox Token Generator")
    print("Choose your method:")
    print("1. Using Dropbox SDK (Recommended)")
    print("2. Using Direct API calls")
    
    try:
        choice = input("\nEnter your choice (1 or 2): ").strip()
        
        if choice == "1":
            tokens = get_new_dropbox_tokens()
        elif choice == "2":
            tokens = simple_token_generation()
        else:
            print("❌ Invalid choice. Using method 1...")
            tokens = get_new_dropbox_tokens()
        
        if tokens:
            print("\n🎉 Token generation completed successfully!")
            print("💡 Remember to restart your FastAPI server to load the new tokens.")
        else:
            print("\n❌ Token generation failed.")
            
    except KeyboardInterrupt:
        print("\n\n👋 Token generation cancelled.")
    except Exception as e:
        print(f"\n❌ Unexpected error: {str(e)}")