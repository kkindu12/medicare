from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uvicorn

# Initialize FastAPI app
app = FastAPI(title="Medicare API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security configurations
SECRET_KEY = "your-secret-key-here"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class User(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    disabled: Optional[bool] = None

class UserInDB(User):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class Appointment(BaseModel):
    id: Optional[int] = None
    patient_email: str
    doctor_name: str
    date: datetime
    time: str
    reason: str
    status: str = "pending"

# Mock database - Replace with actual database in production
fake_users_db = {
    "demo@example.com": {
        "email": "demo@example.com",
        "full_name": "Demo User",
        "hashed_password": pwd_context.hash("password123"),
        "disabled": False,
    }
}

appointments_db = []

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_user(db, email: str):
    if email in db:
        user_dict = db[email]
        return UserInDB(**user_dict)
    return None

def authenticate_user(fake_db, email: str, password: str):
    user = get_user(fake_db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(fake_users_db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# Routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.post("/register")
async def register_user(user: User, password: str):
    if user.email in fake_users_db:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    hashed_password = get_password_hash(password)
    fake_users_db[user.email] = {
        "email": user.email,
        "full_name": user.full_name,
        "hashed_password": hashed_password,
        "disabled": False,
    }
    return {"message": "User registered successfully"}

# Appointment routes
@app.post("/appointments", response_model=Appointment)
async def create_appointment(
    appointment: Appointment,
    current_user: User = Depends(get_current_user)
):
    appointment.id = len(appointments_db) + 1
    appointment.patient_email = current_user.email
    appointments_db.append(appointment)
    return appointment

@app.get("/appointments", response_model=List[Appointment])
async def get_appointments(current_user: User = Depends(get_current_user)):
    return [apt for apt in appointments_db if apt.patient_email == current_user.email]

@app.put("/appointments/{appointment_id}", response_model=Appointment)
async def update_appointment(
    appointment_id: int,
    appointment_update: Appointment,
    current_user: User = Depends(get_current_user)
):
    for i, apt in enumerate(appointments_db):
        if apt.id == appointment_id and apt.patient_email == current_user.email:
            appointment_update.id = appointment_id
            appointment_update.patient_email = current_user.email
            appointments_db[i] = appointment_update
            return appointment_update
    raise HTTPException(status_code=404, detail="Appointment not found")

@app.delete("/appointments/{appointment_id}")
async def delete_appointment(
    appointment_id: int,
    current_user: User = Depends(get_current_user)
):
    for i, apt in enumerate(appointments_db):
        if apt.id == appointment_id and apt.patient_email == current_user.email:
            appointments_db.pop(i)
            return {"message": "Appointment deleted successfully"}
    raise HTTPException(status_code=404, detail="Appointment not found")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True) 