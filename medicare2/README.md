# Medicare FastAPI Backend

A comprehensive FastAPI backend application for Medicare Pharmacy & Laboratory Management System.

## Features

### Laboratory Management
- **Test Catalog**: Complete list of available laboratory tests with details
- **Test Requests**: Submit and manage test requests with patient information
- **File Upload**: Upload doctor referrals for test requests
- **Search & Filter**: Advanced search and filtering capabilities
- **Status Tracking**: Track test request status from pending to completed

### Pharmacy Management
- **Medicine Inventory**: Complete medicine catalog with stock management
- **Order Processing**: Process medicine orders with prescription validation
- **Stock Management**: Automatic stock updates and low stock alerts
- **File Upload**: Upload prescriptions for medicine orders
- **Inventory Reports**: Comprehensive inventory summary and statistics

### File Management
- **Secure Upload**: File validation for size and type
- **Supported Formats**: PDF, JPG, JPEG, PNG, GIF
- **File Size Limit**: 5MB maximum file size
- **Organized Storage**: Separate directories for referrals and prescriptions

## API Endpoints

### Laboratory Endpoints
- `GET /api/laboratory/tests` - Get all laboratory tests
- `GET /api/laboratory/tests/search` - Search tests with filters
- `GET /api/laboratory/tests/categories` - Get test categories
- `GET /api/laboratory/tests/locations` - Get test locations
- `GET /api/laboratory/tests/{test_name}` - Get specific test details
- `POST /api/laboratory/requests` - Create test request
- `POST /api/laboratory/requests/{request_id}/upload-referral` - Upload referral
- `GET /api/laboratory/requests` - Get all test requests
- `GET /api/laboratory/requests/{request_id}` - Get specific test request
- `PUT /api/laboratory/requests/{request_id}/status` - Update request status
- `DELETE /api/laboratory/requests/{request_id}` - Delete test request

### Pharmacy Endpoints
- `GET /api/pharmacy/medicines` - Get all medicines
- `GET /api/pharmacy/medicines/search` - Search medicines with filters
- `GET /api/pharmacy/medicines/categories` - Get medicine categories
- `GET /api/pharmacy/medicines/manufacturers` - Get manufacturers
- `GET /api/pharmacy/medicines/low-stock` - Get low stock medicines
- `GET /api/pharmacy/medicines/{medicine_name}` - Get specific medicine
- `POST /api/pharmacy/orders` - Create medicine order
- `POST /api/pharmacy/orders/{order_id}/upload-prescription` - Upload prescription
- `GET /api/pharmacy/orders` - Get all medicine orders
- `GET /api/pharmacy/orders/{order_id}` - Get specific order
- `PUT /api/pharmacy/orders/{order_id}/status` - Update order status
- `DELETE /api/pharmacy/orders/{order_id}` - Delete order
- `GET /api/pharmacy/inventory/summary` - Get inventory summary

## Installation

1. **Install Python** (3.8 or higher)

2. **Clone or navigate to the medicare2 directory**

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

### Option 1: Using the batch file (Windows)
Double-click `start_server.bat` to start the server.

### Option 2: Using Python directly
```bash
python run.py
```

### Option 3: Using uvicorn directly
```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

## Access the Application

- **API Server**: http://127.0.0.1:8000
- **Interactive API Documentation**: http://127.0.0.1:8000/docs
- **Alternative API Docs**: http://127.0.0.1:8000/redoc

## Project Structure

```
medicare2/
├── main.py                 # FastAPI application entry point
├── run.py                  # Server startup script
├── start_server.bat        # Windows batch file for easy startup
├── config.py               # Application configuration
├── utils.py                # Utility functions
├── requirements.txt        # Python dependencies
├── routers/
│   ├── __init__.py
│   ├── laboratory.py       # Laboratory endpoints
│   └── pharmacy.py         # Pharmacy endpoints
├── models/
│   ├── __init__.py
│   ├── laboratory.py       # Laboratory data models
│   └── pharmacy.py         # Pharmacy data models
└── uploads/
    ├── referrals/          # Uploaded referral files
    └── prescriptions/      # Uploaded prescription files
```

## Configuration

The application uses environment-based configuration in `config.py`:

- **CORS Origins**: Configured for Angular frontend (localhost:4200)
- **File Upload**: 5MB limit, PDF and image formats
- **Stock Management**: Low stock threshold set to 10 units
- **Upload Directories**: Automatic creation of upload folders

## Data Models

### Laboratory Models
- **LabTest**: Test information with pricing and location
- **TestRequest**: Patient test request with clinical information
- **TestRequestResponse**: Complete test request with metadata

### Pharmacy Models
- **Medicine**: Medicine information with stock and pricing
- **MedicineOrder**: Patient medicine order with prescription details
- **MedicineOrderResponse**: Complete order with total price calculation

## Features in Detail

### Search and Filtering
- **Text Search**: Search across multiple fields
- **Category Filtering**: Filter by test/medicine categories
- **Status Filtering**: Filter by availability/stock status
- **Location Filtering**: Filter by laboratory locations

### File Upload Security
- **File Type Validation**: Only allowed formats accepted
- **Size Validation**: Enforced file size limits
- **Secure Storage**: Files stored in organized directories
- **Unique Naming**: Prevents file name conflicts

### Stock Management
- **Automatic Updates**: Stock decreases with orders
- **Status Tracking**: Automatic status updates (In Stock/Low Stock/Out of Stock)
- **Inventory Reports**: Comprehensive inventory statistics

### API Response Format
All endpoints return consistent JSON responses with appropriate HTTP status codes:
- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **500**: Internal Server Error

## CORS Configuration

The application is configured to accept requests from:
- http://localhost:4200 (Angular development server)
- http://localhost:3000 (Alternative frontend port)
- http://127.0.0.1:4200
- http://127.0.0.1:3000

## Development

### Adding New Endpoints
1. Add new routes to appropriate router files
2. Create corresponding Pydantic models
3. Update documentation

### Database Integration
The current implementation uses in-memory storage. To add database support:
1. Install database dependencies (SQLAlchemy, etc.)
2. Create database models
3. Update routers to use database operations

### Authentication
To add authentication:
1. Install python-jose and passlib
2. Create authentication middleware
3. Protect routes with authentication decorators

## Testing

Use the interactive API documentation at http://127.0.0.1:8000/docs to test all endpoints.

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - Change port in `run.py` or kill existing process

2. **Module Import Errors**:
   - Ensure all dependencies are installed: `pip install -r requirements.txt`

3. **File Upload Errors**:
   - Check file size (max 5MB)
   - Verify file format (PDF, JPG, PNG, GIF)
   - Ensure upload directories exist

4. **CORS Errors**:
   - Verify frontend URL in `config.py`
   - Check CORS middleware configuration

## Production Deployment

For production deployment:
1. Use a production WSGI server (Gunicorn)
2. Set up proper database (PostgreSQL/MySQL)
3. Configure environment variables
4. Set up proper logging
5. Use reverse proxy (Nginx)
6. Enable HTTPS

## Contributing

1. Follow PEP 8 style guidelines
2. Add appropriate type hints
3. Include docstrings for functions
4. Update README for new features
