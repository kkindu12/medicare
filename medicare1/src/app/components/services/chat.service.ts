import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { Message, MessageType } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  getDoctors() {
    throw new Error('Method not implemented.');
  }
  private readonly API_URL = 'http://localhost:8000';
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  private isTypingSubject = new BehaviorSubject<boolean>(false);
  public isTyping$ = this.isTypingSubject.asObservable();
  
  constructor(private http: HttpClient) {
    // Initialize with welcome message
    this.addMessage({
      id: this.generateId(),
      text: 'Hello! I\'m your health assistant. How can I help you today?',
      type: MessageType.BOT,
      timestamp: new Date(),
      options: [
        'Healthy eating tips',
        'Exercise recommendations',
        'Sleep improvement',
        'Stress management'
      ]
    });
  }

  sendMessage(text: string): void {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: this.generateId(),
      text,
      type: MessageType.USER,
      timestamp: new Date()
    };
    
    this.addMessage(userMessage);
    this.setTyping(true);
    
    // In a real app, we would call the backend API
    // this.http.post<any>(`${this.API_URL}/chat`, { message: text })
    
    // For demo purposes, we'll simulate a response
    this.getMockResponse(text).subscribe(response => {
      this.setTyping(false);
      this.addMessage({
        id: this.generateId(),
        text: response.text,
        type: MessageType.BOT,
        timestamp: new Date(),
        options: response.options
      });
    });
  }
  
  private addMessage(message: Message): void {
    const currentMessages = this.messagesSubject.getValue();
    this.messagesSubject.next([...currentMessages, message]);
  }
  
  private setTyping(isTyping: boolean): void {
    this.isTypingSubject.next(isTyping);
  }
  
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
  
  private getMockResponse(text: string): Observable<{text: string, options?: string[]}> {
    let response = {
      text: 'I\'m not sure how to respond to that. Could you try asking about healthy eating, exercise, sleep, or stress management?',
      options: ['Healthy eating tips', 'Exercise recommendations', 'Sleep improvement', 'Stress management']
    };
    
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('eat') || lowerText.includes('food') || lowerText.includes('diet') || lowerText.includes('nutrition')) {
      response = {
        text: 'For a healthy diet, focus on whole foods like fruits, vegetables, lean proteins, and whole grains. Limit processed foods, added sugars, and excessive salt. Stay hydrated by drinking plenty of water throughout the day.',
        options: ['How much water should I drink?', 'Best fruits for health', 'Healthy snack ideas']
      };
    } else if (lowerText.includes('exercise') || lowerText.includes('workout') || lowerText.includes('fitness')) {
      response = {
        text: 'Regular physical activity is key to good health. Aim for at least 150 minutes of moderate activity or 75 minutes of vigorous activity per week. Include both cardio and strength training for optimal benefits.',
        options: ['Beginner workout ideas', 'Exercise without equipment', 'How often should I exercise?']
      };
    } else if (lowerText.includes('sleep') || lowerText.includes('rest') || lowerText.includes('tired')) {
      response = {
        text: 'Good sleep is essential for health. Aim for 7-9 hours per night. Establish a regular sleep schedule, create a relaxing bedtime routine, and make your bedroom comfortable, dark, and quiet.',
        options: ['Tips for better sleep', 'How to fall asleep faster', 'Sleep and stress connection']
      };
    } else if (lowerText.includes('stress') || lowerText.includes('anxiety') || lowerText.includes('worry')) {
      response = {
        text: 'Managing stress is important for your overall health. Try relaxation techniques like deep breathing, meditation, or yoga. Regular exercise and adequate sleep also help reduce stress levels.',
        options: ['Quick stress relief', 'Meditation basics', 'When to seek professional help']
      };
    }
    
    // Simulate network delay
    return of(response).pipe(
      delay(Math.random() * 1000 + 500),
      tap(() => console.log('Responding with:', response))
    );
  }
}