from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models.notification import Notification, CreateNotificationRequest
from services.database import get_db
from datetime import datetime
import uuid

router = APIRouter()

# Get notifications for a specific user
@router.get("/{user_id}", response_model=List[Notification])
async def get_user_notifications(user_id: str, db=Depends(get_db)):
    print(f"Getting notifications for user: {user_id}")
    try:
        # Query notifications for the user, ordered by creation date (newest first)
        cursor = db.notifications.find({"userId": user_id}).sort("createdAt", -1)
        notifications = []
        
        for notification in cursor:
            notifications.append(Notification(
                id=str(notification["_id"]),
                userId=notification["userId"],
                title=notification["title"],
                message=notification["message"],
                type=notification["type"],
                relatedRecordId=notification.get("relatedRecordId"),
                createdAt=notification["createdAt"],
                read=notification["read"],
                createdBy=notification.get("createdBy"),
                createdByName=notification.get("createdByName")
            ))
        
        print(f"Found {len(notifications)} notifications for user {user_id}")
        return notifications
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch notifications: {str(e)}")

# Create a new notification
@router.post("", response_model=Notification)
async def create_notification(notification: CreateNotificationRequest, db=Depends(get_db)):
    try:
        notification_id = str(uuid.uuid4())
        current_time = datetime.now().isoformat()
        
        notification_doc = {
            "_id": notification_id,
            "userId": notification.userId,
            "title": notification.title,
            "message": notification.message,
            "type": notification.type,
            "relatedRecordId": notification.relatedRecordId,
            "createdAt": current_time,
            "read": False,
            "createdBy": notification.createdBy,
            "createdByName": notification.createdByName
        }
        
        db.notifications.insert_one(notification_doc)
        
        return Notification(
            id=notification_id,
            userId=notification.userId,
            title=notification.title,
            message=notification.message,
            type=notification.type,
            relatedRecordId=notification.relatedRecordId,
            createdAt=current_time,
            read=False,
            createdBy=notification.createdBy,
            createdByName=notification.createdByName
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create notification: {str(e)}")

# Mark a notification as read
@router.put("/{notification_id}/read")
async def mark_notification_as_read(notification_id: str, db=Depends(get_db)):
    try:
        result = db.notifications.update_one(
            {"_id": notification_id},
            {"$set": {"read": True}}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"message": "Notification marked as read"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mark notification as read: {str(e)}")

# Mark all notifications as read for a user
@router.put("/{user_id}/read-all")
async def mark_all_notifications_as_read(user_id: str, db=Depends(get_db)):
    try:
        result = db.notifications.update_many(
            {"userId": user_id, "read": False},
            {"$set": {"read": True}}
        )
        
        return {"message": f"Marked {result.modified_count} notifications as read"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to mark all notifications as read: {str(e)}")

# Delete a notification
@router.delete("/{notification_id}")
async def delete_notification(notification_id: str, db=Depends(get_db)):
    try:
        result = db.notifications.delete_one({"_id": notification_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        return {"message": "Notification deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete notification: {str(e)}")
