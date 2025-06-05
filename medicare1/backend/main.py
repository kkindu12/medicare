# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from typing import List, Optional
# from fastapi.middleware.cors import CORSMiddleware
# import openai
# import traceback

# import openai

# app = FastAPI()
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:4200"],  # Allow your Angular dev server
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class MessageRequest(BaseModel):
#     message: str

# class MessageResponse(BaseModel):
#     text: str
#     # options: Optional[List[str]] = None


# def categorize_message(message: str) -> str:
#     message = message.lower()
#     if any(word in message for word in ["hi", "hello", "hey"]):
#         return "greeting"
#     elif any(word in message for word in ["diet", "food", "nutrition"]):
#         return "diet"
#     elif any(word in message for word in ["exercise", "workout", "fitness"]):
#         return "exercise"
#     elif any(word in message for word in ["sleep", "rest"]):
#         return "sleep"
#     elif any(word in message for word in ["stress", "anxiety"]):
#         return "stress"
#     elif any(word in message for word in ["water", "drink", "hydrate"]):
#         return "water"
#     else:
#         return "ai"


# # client = openai.OpenAI(api_key="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")

# # def get_ai_response(message: str) -> str:
# #     response = client.chat.completions.create(
# #         model="gpt-3.5-turbo",
# #         messages=[
# #             {
# #                 "role": "system",
# #                 "content": (
# #                     "You are a professional, concise, and safe health assistant. "
# #                     "Answer health-related questions clearly. "
# #                     "If a question is about symptoms or illness, give general advice and recommend seeing a doctor for emergencies. "
# #                     "Never give a diagnosis or prescribe medication. Always encourage consulting a healthcare professional for serious or urgent issues."
# #                 )
# #             },
# #             {"role": "user", "content": message}
# #         ],
# #         max_tokens=200,
# #         temperature=0.7
# #     )
# #     return response.choices[0].message.content

# # filepath: [main.py](http://_vscodecontentref_/0)
# # @app.post("/chat", response_model=MessageResponse)
# # def chat(request: MessageRequest):
# #     try:
# #         ai_text = get_ai_response(request.message)
# #         return MessageResponse(text=ai_text)
# #     except Exception as e:
# #         print("Error in /chat:", e)
# #         traceback.print_exc()
# #         raise HTTPException(status_code=500, detail=str(e))
# # @app.get("/")
# # def read_root():
# #     return {"message": "Health assistant backend is running."}


# backend/main.py
# from fastapi import FastAPI, HTTPException, Depends
# from pydantic import BaseModel
# from typing import List, Optional
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from passlib.context import CryptContext
# from jose import JWTError, jwt
# from datetime import datetime, timedelta

# app = FastAPI()

# # Dummy in-memory "database"
# users_db = {}
# messages_db = []

# # Password hashing
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# # JWT config
# SECRET_KEY = "your-secret-key"
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRE_MINUTES = 30

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# # Models
# class User(BaseModel):
#     username: str
#     hashed_password: str
#     role: str  # "doctor" or "patient"

# class UserCreate(BaseModel):
#     username: str
#     password: str
#     role: str

# class Token(BaseModel):
#     access_token: str
#     token_type: str

# class Message(BaseModel):
#     sender: str
#     receiver: str
#     content: str
#     timestamp: datetime

# # Helper functions
# def verify_password(plain_password, hashed_password):
#     return pwd_context.verify(plain_password, hashed_password)

# def get_password_hash(password):
#     return pwd_context.hash(password)

# def authenticate_user(username: str, password: str):
#     user = users_db.get(username)
#     if not user:
#         return False
#     if not verify_password(password, user.hashed_password):
#         return False
#     return user

# def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
#     to_encode = data.copy()
#     expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
#     to_encode.update({"exp": expire})
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
#     return encoded_jwt

# async def get_current_user(token: str = Depends(oauth2_scheme)):
#     credentials_exception = HTTPException(status_code=401, detail="Could not validate credentials")
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#     except JWTError:
#         raise credentials_exception
#     user = users_db.get(username)
#     if user is None:
#         raise credentials_exception
#     return user

# # Routes
# @app.post("/signup", response_model=User)
# def signup(user: UserCreate):
#     if user.username in users_db:
#         raise HTTPException(status_code=400, detail="Username already registered")
#     hashed_password = get_password_hash(user.password)
#     new_user = User(username=user.username, hashed_password=hashed_password, role=user.role)
#     users_db[user.username] = new_user
#     return new_user

# @app.post("/token", response_model=Token)
# def login(form_data: OAuth2PasswordRequestForm = Depends()):
#     user = authenticate_user(form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#     access_token = create_access_token(data={"sub": user.username})
#     return {"access_token": access_token, "token_type": "bearer"}

# @app.post("/messages")
# def send_message(message: Message, current_user: User = Depends(get_current_user)):
#     # Ensure sender is current user
#     if message.sender != current_user.username:
#         raise HTTPException(status_code=403, detail="Cannot send message on behalf of another user")
#     messages_db.append(message)
#     return {"msg": "Message sent"}

# @app.get("/messages/{with_user}", response_model=List[Message])
# def get_messages(with_user: str, current_user: User = Depends(get_current_user)):
#     # Get messages between current_user and with_user
#     result = [
#         msg for msg in messages_db
#         if (msg.sender == current_user.username and msg.receiver == with_user) or
#            (msg.sender == with_user and msg.receiver == current_user.username)
#     ]
#     return result


# chat-page backend

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from typing import List
app = FastAPI()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.users = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    username = None
    try:
        while True:
            data = await websocket.receive_json()
            action = data.get("action")
            if action == "register":
                user = data.get("user")
                if any(u["username"] == user["username"] for u in manager.users):
                    await websocket.send_json({"status": "error", "message": "Username already exists"})
                else:
                    manager.users.append(user)
                    username = user["username"]
                    await manager.broadcast({"type": "users", "users": manager.users})
                    await websocket.send_json({"status": "success", "message": "User registered successfully"})
            elif action == "send-message":
                message = data.get("message")
                await manager.broadcast({"type": "new-message", "user": username, "message": message})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        if username:
            manager.users = [u for u in manager.users if u["username"] != username]
            await manager.broadcast({"type": "users", "users": manager.users})