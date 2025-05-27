# Medicare

## Environment Setup

This project uses environment variables for configuration. Follow these steps to set up your environment:

1. Copy `.env.example` to `.env` in the medicare2 directory
2. Fill in your credentials for MongoDB and Dropbox
3. Never commit `.env` files to version control

## Security Best Practices

- Environment variables are used for all sensitive credentials
- `.env` files are excluded from git via .gitignore
- Credentials should be rotated regularly
- Each developer should maintain their own local .env file