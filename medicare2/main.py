from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.patient import router as patient_router
from routers.user import router as user_router
from routers.patientRecord import router as patientRecord_router
import uvicorn

app = FastAPI(title="Medicare EMR API")

# Configure CORS to allow Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Adjust if your Angular app runs on a different port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include patient router
app.include_router(patient_router, prefix="/api")
app.include_router(patientRecord_router, prefix="/api")
app.include_router(user_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)