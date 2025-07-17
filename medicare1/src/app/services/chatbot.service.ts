import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  id: string;
  message: string;
  timestamp: Date;
  isBot: boolean;
  isTyping?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private predefinedResponses: { [key: string]: string[] } = {
    'hello': [
      'Hello! I\'m your healthcare assistant. How can I help you today?',
      'Hi there! I\'m here to help with your health questions.',
      'Hello! What health concerns can I assist you with?'
    ],
    'appointment': [
      'I can help you with appointment-related questions. You can book, reschedule, or check your upcoming appointments through your dashboard.',
      'For appointments, you can use the booking system or contact your doctor directly. Would you like me to guide you through the process?'
    ],
    'symptoms': [
      'I understand you have some health concerns. While I can provide general information, please remember that for serious symptoms, you should consult with a healthcare professional.',
      'Please describe your symptoms, and I\'ll provide some general guidance. However, this doesn\'t replace professional medical advice.'
    ],
    'medication': [
      'For medication questions, it\'s best to consult your doctor or pharmacist. I can provide general information, but specific medication advice should come from healthcare professionals.',
      'Medication information is best discussed with your healthcare provider. They can give you personalized advice based on your medical history.'
    ],
    'emergency': [
      'If this is a medical emergency, please call 911 or go to your nearest emergency room immediately.',
      'For urgent medical situations, please contact emergency services or visit the nearest hospital.'
    ],
    'pain': [
      'I understand you\'re experiencing pain. Pain can have many causes, and it\'s important to have it evaluated by a healthcare professional if it persists.',
      'Pain management varies depending on the cause. I recommend discussing your pain with your doctor for proper evaluation and treatment.'
    ],
    'default': [
      'I understand your concern. While I can provide general health information, I recommend consulting with a healthcare professional for personalized advice.',
      'That\'s a good question. For specific health concerns, it\'s always best to consult with your doctor who knows your medical history.',
      'I\'m here to help with general health information. For detailed medical advice, please consult with a healthcare professional.'
    ]
  };

  constructor() {
    // Initialize with welcome message
    this.addMessage(
      'Hello! I\'m your healthcare assistant. I can help answer general health questions, provide information about appointments, and guide you through your healthcare journey. How can I assist you today?',
      true
    );
  }

  private addMessage(message: string, isBot: boolean): void {
    const currentMessages = this.messagesSubject.value;
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message,
      timestamp: new Date(),
      isBot: isBot
    };
    this.messagesSubject.next([...currentMessages, newMessage]);
  }

  public sendMessage(userMessage: string): void {
    // Add user message
    this.addMessage(userMessage, false);

    // Show typing indicator
    this.addTypingIndicator();

    // Simulate thinking time and respond
    setTimeout(() => {
      this.removeTypingIndicator();
      const botResponse = this.generateResponse(userMessage);
      this.addMessage(botResponse, true);
    }, 1500);
  }

  private addTypingIndicator(): void {
    const currentMessages = this.messagesSubject.value;
    const typingMessage: ChatMessage = {
      id: 'typing',
      message: '',
      timestamp: new Date(),
      isBot: true,
      isTyping: true
    };
    this.messagesSubject.next([...currentMessages, typingMessage]);
  }

  private removeTypingIndicator(): void {
    const currentMessages = this.messagesSubject.value;
    const filteredMessages = currentMessages.filter(msg => msg.id !== 'typing');
    this.messagesSubject.next(filteredMessages);
  }

  private generateResponse(userMessage: string): string {
    const message = userMessage.toLowerCase();
    
    // Check for keywords and provide appropriate responses
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return this.getRandomResponse('hello');
    }
    
    if (message.includes('appointment') || message.includes('booking') || message.includes('schedule')) {
      return this.getRandomResponse('appointment');
    }
    
    if (message.includes('symptom') || message.includes('feel') || message.includes('sick')) {
      return this.getRandomResponse('symptoms');
    }
    
    if (message.includes('medication') || message.includes('medicine') || message.includes('drug') || message.includes('prescription')) {
      return this.getRandomResponse('medication');
    }
    
    if (message.includes('emergency') || message.includes('urgent') || message.includes('serious')) {
      return this.getRandomResponse('emergency');
    }
    
    if (message.includes('pain') || message.includes('hurt') || message.includes('ache')) {
      return this.getRandomResponse('pain');
    }
    
    return this.getRandomResponse('default');
  }

  private getRandomResponse(category: string): string {
    const responses = this.predefinedResponses[category] || this.predefinedResponses['default'];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  public clearChat(): void {
    this.messagesSubject.next([]);
    // Add welcome message again
    this.addMessage(
      'Hello! I\'m your healthcare assistant. How can I help you today?',
      true
    );
  }
}
