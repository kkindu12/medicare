import { Component, ViewChild, ElementRef, AfterViewChecked  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';



import { Socket } from 'socket.io-client';
import io from 'socket.io-client';

@Component({
  selector: 'app-chat-page',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements AfterViewChecked {

  messages: { text: string; from: string }[] = [];
  inputMessage = '';
  isLoggedIn = false;
  @ViewChild('scrollMe') private scrollContainer!: ElementRef;
  socket!: ReturnType<typeof io>;

  constructor() {
    // Replace 'http://localhost:3000' with your actual backend socket server URL
    this.socket = io('http://localhost:8000');
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage() {
    if (this.inputMessage.trim()) {
      this.messages.push({ text: this.inputMessage, from: 'user' });
      
      // Simulate bot response
      setTimeout(() => {
        this.messages.push({ text: 'Bot says: ' + this.inputMessage, from: 'bot' });
        this.scrollToBottom();
      }, 500);

      this.inputMessage = '';
    }
  }
  LogIn(){
    this.messages.push({ text: 'You can start chatting..', from: 'system' });
    this.scrollToBottom();
    console.log('User logged in');
    this.isLoggedIn=true
  }
sendMessageToSocket(message: string) {
  this.socket.emit('new_message', message);
}
sendUser(message: string): void {
  this.socket.emit('new_message', message);
}
  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
}
