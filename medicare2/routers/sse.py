from fastapi import APIRouter, Request
from fastapi.responses import StreamingResponse
from typing import AsyncGenerator
import asyncio
import json
import time
from services.database import get_db
from bson import ObjectId

router = APIRouter()

# Store active SSE connections
active_connections = {}

async def notification_stream(user_id: str) -> AsyncGenerator[str, None]:
    """
    Server-Sent Events stream for real-time notifications
    """
    try:
        # Store this connection
        active_connections[user_id] = True
        
        # Send initial connection message
        yield f"data: {json.dumps({'type': 'connected', 'message': 'SSE connection established'})}\n\n"
        
        # Keep connection alive and check for new notifications
        last_check = time.time()
        
        while active_connections.get(user_id, False):
            try:
                # Check for new notifications every second
                db = get_db()
                current_time = time.time()
                
                # Get notifications created in the last few seconds
                # This is a simple approach - in production you'd want a more sophisticated change detection
                notifications = list(db.notifications.find({
                    "userId": user_id,
                    "read": False
                }).sort("createdAt", -1).limit(10))
                
                if notifications:
                    # Convert ObjectId to string for JSON serialization
                    for notification in notifications:
                        notification["_id"] = str(notification["_id"])
                    
                    yield f"data: {json.dumps({'type': 'notifications', 'data': notifications})}\n\n"
                
                # Send heartbeat every 30 seconds
                if current_time - last_check > 30:
                    yield f"data: {json.dumps({'type': 'heartbeat', 'timestamp': current_time})}\n\n"
                    last_check = current_time
                
                # Wait before next check
                await asyncio.sleep(1)
                
            except Exception as e:
                print(f"Error in notification stream: {e}")
                yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
                break
                
    except asyncio.CancelledError:
        print(f"SSE connection cancelled for user {user_id}")
    finally:
        # Clean up connection
        if user_id in active_connections:
            del active_connections[user_id]
        print(f"SSE connection closed for user {user_id}")

@router.get("/sse/notifications/{user_id}")
async def get_notification_stream(user_id: str, request: Request):
    """
    Endpoint for Server-Sent Events notification stream
    """
    return StreamingResponse(
        notification_stream(user_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Cache-Control",
        }
    )

@router.post("/sse/trigger/{user_id}")
async def trigger_notification_update(user_id: str):
    """
    Endpoint to trigger immediate notification update for a user
    This can be called when a new notification is created
    """
    try:
        if user_id in active_connections:
            # In a real implementation, you'd use a more sophisticated pub/sub system
            # For now, this endpoint can be called to trigger an immediate check
            return {"message": f"Notification update triggered for user {user_id}"}
        else:
            return {"message": f"No active SSE connection for user {user_id}"}
    except Exception as e:
        return {"error": str(e)}
