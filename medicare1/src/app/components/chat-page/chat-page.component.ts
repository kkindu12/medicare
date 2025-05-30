import { Component, ViewChild, ElementRef, AfterViewChecked  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-chat-page',
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements AfterViewChecked {

  messages: { text: string; from: string }[] = [];
  inputMessage = '';

  @ViewChild('scrollMe') private scrollContainer!: ElementRef;

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

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
}
