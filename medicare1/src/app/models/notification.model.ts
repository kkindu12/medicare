export type NotificationType = 'medical_record' | 'appointment' | 'appointment_approved' | 'appointment_rejected' | 'prescription' | 'lab_result' | 'general';

export interface UserNotification {
  id: string;
  userId: string;  // The patient who should receive the notification
  title: string;
  message: string;
  type: NotificationType;
  relatedRecordId?: string;  // If related to a medical record
  createdAt: string;
  read: boolean;
  createdBy?: string;  // Doctor ID who created the notification
  createdByName?: string;  // Doctor name who created the notification
}

export interface CreateNotificationRequest {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  relatedRecordId?: string;
  createdBy?: string;
  createdByName?: string;
}
