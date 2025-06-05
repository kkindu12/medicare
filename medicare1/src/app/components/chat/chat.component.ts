import { Component, ViewChild, ElementRef, AfterViewChecked, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../services/chat.service';
import { Message, MessageType } from '../models/message.model';
import { MessageComponent } from '../message/message.component';
import { HttpClientModule } from '@angular/common/http';
import { ChatPageComponent } from '../chat-page/chat-page.component';
@Component({
  selector: 'app-chat',
  standalone: true, 
  imports: [CommonModule, FormsModule, MessageComponent,HttpClientModule], 
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'], 
  providers: [ChatService]
})
export class ChatComponent implements OnInit, AfterViewChecked { // Implement interfaces
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: Message[] = [];
  isTyping = false;
  messageText = '';

  constructor(@Inject(ChatService) private chatService: ChatService) {}

  ngOnInit(): void {
    this.chatService.messages$.subscribe((messages: Message[]) => {
      this.messages = messages;
    });

    this.chatService.isTyping$.subscribe((isTyping: boolean) => {
      this.isTyping = isTyping;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  sendMessage(text: string): void {
    if (!text.trim()) return;
    this.chatService.sendMessage(text);
    this.messageText = ''; // Clear input after sending
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
}