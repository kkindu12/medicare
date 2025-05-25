
# This code is part of a FastAPI application that serves as a health assistant bot.
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import random
from datetime import datetime

#  This code is part of a FastAPI application that serves as a chat bot to patients and doctors.
from typing import List, Optional
import json
from datetime import datetime
import base64

app = FastAPI(title="HealthBot API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load predefined responses
responses = {
    "greeting": [
        "Hello! How can I help with your health questions today?",
        "Hi there! I'm your health assistant. What would you like to know?",
        "Welcome! I'm here to provide health information. What can I help you with?"
    ],
    "diet": [
        "A balanced diet should include fruits, vegetables, whole grains, lean proteins, and healthy fats. Try to minimize processed foods and added sugars.",
        "Consider the Mediterranean diet, which is rich in fruits, vegetables, whole grains, and olive oil. It's associated with numerous health benefits.",
        "Portion control is key to a healthy diet. Use smaller plates, eat slowly, and listen to your body's hunger and fullness cues."
    ],
    "exercise": [
        "Aim for at least 150 minutes of moderate aerobic activity or 75 minutes of vigorous activity each week, plus muscle-strengthening exercises twice a week.",
        "Start with simple activities like walking, swimming, or cycling. Gradually increase intensity and duration as your fitness improves.",
        "Mix cardio, strength training, and flexibility exercises for a well-rounded fitness routine."
    ],
    "sleep": [
        "Most adults need 7-9 hours of quality sleep per night. Keep a consistent sleep schedule, even on weekends.",
        "Create a relaxing bedtime routine and make your bedroom cool, dark, and quiet to improve sleep quality.",
        "Avoid caffeine, alcohol, and electronic devices before bedtime, as they can interfere with sleep."
    ],
    "stress": [
        "Practice relaxation techniques like deep breathing, meditation, or progressive muscle relaxation to manage stress.",
        "Regular physical activity can help reduce stress and improve mood by releasing endorphins.",
        "Connect with others, maintain a positive outlook, and seek professional help if stress becomes overwhelming."
    ],
    "water": [
        "Aim to drink about 8 glasses (64 ounces) of water daily, though individual needs vary based on activity level, climate, and overall health.",
        "Stay hydrated throughout the day. Your urine should be pale yellow – darker urine may indicate dehydration.",
        "In addition to water, you can get fluids from other beverages and water-rich foods like fruits and vegetables."
    ],
    "fallback": [
        "I'm not sure I understand your question. Could you rephrase it or ask about diet, exercise, sleep, stress, or hydration?",
        "I don't have information on that specific topic. I can help with questions about healthy lifestyle habits like diet, exercise, and sleep.",
        "That's beyond my current knowledge. I'm best at answering questions about general health and wellness topics."
    ]
}

# Define models
class MessageRequest(BaseModel):
    message: str

class Option(BaseModel):
    text: str

class MessageResponse(BaseModel):
    text: str
    options: Optional[List[str]] = None

# Helper function to determine response category
def categorize_message(message: str) -> str:
    message = message.lower()
    
    if any(word in message for word in ["hi", "hello", "hey", "greet"]):
        return "greeting"
    elif any(word in message for word in ["eat", "food", "diet", "nutrition"]):
        return "diet"
    elif any(word in message for word in ["exercise", "workout", "fitness", "activity"]):
        return "exercise"
    elif any(word in message for word in ["sleep", "rest", "bed", "tired"]):
        return "sleep"
    elif any(word in message for word in ["stress", "anxiety", "worry", "relax"]):
        return "stress"
    elif any(word in message for word in ["water", "drink", "hydrate", "thirsty"]):
        return "water"
    else:
        return "fallback"

# Generate relevant options based on response category
def generate_options(category: str) -> List[str]:
    options_map = {
        "greeting": ["Tell me about healthy eating", "Exercise recommendations", "Sleep improvement tips", "Stress management"],
        "diet": ["Healthy meal ideas", "Best foods for energy", "How much water should I drink?", "Nutrition for weight management"],
        "exercise": ["Beginner workout tips", "How often should I exercise?", "Best time to exercise", "Exercises for stress relief"],
        "sleep": ["Tips for better sleep", "How to fall asleep faster", "Sleep and stress connection", "Best sleeping position"],
        "stress": ["Quick stress relief techniques", "Meditation basics", "Exercise for stress relief", "When to seek professional help"],
        "water": ["Benefits of hydration", "Signs of dehydration", "Best drinks besides water", "Hydration and exercise"],
        "fallback": ["Healthy eating tips", "Exercise recommendations", "Sleep improvement", "Stress management"]
    }
    
    return options_map.get(category, options_map["fallback"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the HealthBot API"}

@app.post("/chat", response_model=MessageResponse)
def chat(request: MessageRequest):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    category = categorize_message(request.message)
    response_text = random.choice(responses[category])
    options = generate_options(category)
    
    return MessageResponse(
        text=response_text,
        options=options
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

    app = FastAPI(title="Healthcare Chat API")

# # Configure CORS
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# class Doctor(BaseModel):
#     id: str
#     name: str
#     specialty: str
#     image: str
#     status: str = "online"

# class Message(BaseModel):
#     id: str
#     sender_id: str
#     receiver_id: str
#     content: str
#     timestamp: datetime
#     image_url: Optional[str] = None

# # Sample data - In production, use a database
# doctors = [
#     Doctor(
#         id="1",
#         name="Dr. Sarah Johnson",
#         specialty="Cardiologist",
#         image="https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg",
#         status="online"
#     ),
#     Doctor(
#         id="2",
#         name="Dr. Michael Chen",
#         specialty="Dermatologist",
#         image="https://images.pexels.com/photos/5452291/pexels-photo-5452291.jpeg",
#         status="online"
#     ),
#     Doctor(
#         id="3",
#         name="Dr. Emily Brown",
#         specialty="Pediatrician",
#         image="https://images.pexels.com/photos/5452268/pexels-photo-5452268.jpeg",
#         status="offline"
#     )
# ]

# messages = []

# @app.get("/doctors")
# async def get_doctors():
#     return doctors

# @app.get("/messages/{user_id}/{doctor_id}")
# async def get_messages(user_id: str, doctor_id: str):
#     chat_messages = [
#         msg for msg in messages 
#         if (msg.sender_id == user_id and msg.receiver_id == doctor_id) or 
#            (msg.sender_id == doctor_id and msg.receiver_id == user_id)
#     ]
#     return chat_messages

# @app.post("/messages")
# async def send_message(message: Message):
#     messages.append(message)
#     return message

# @app.post("/upload-image")
# async def upload_image(file: UploadFile = File(...)):
#     # In production, save to cloud storage and return URL
#     contents = await file.read()
#     base64_image = base64.b64encode(contents).decode()
#     return {"image_url": f"data:{file.content_type};base64,{base64_image}"}