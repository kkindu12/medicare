export enum MessageType {
  USER = 'user',
  BOT = 'bot',
  TYPING = 'typing',
  Info = 'info',
  Warning = 'warning',
  Error = 'error'
}

export interface Message {
  id: string;
  text?: string;
  content?: string;
  type: MessageType;
  timestamp?: Date;
  options?: string[];
}
