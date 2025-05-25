import { Component, EventEmitter, Input, Output  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Message, MessageType } from '../models/message.model';

@Component({
  selector: 'app-message',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'] 
})
export class MessageComponent {
@Input() message!: Message;
  @Output() optionSelected = new EventEmitter<string>();
  
  messageType = MessageType;
  
  onOptionSelected(option: string): void {
    this.optionSelected.emit(option);
  }
}
