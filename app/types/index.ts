export interface User {
  _id: string;
  email: string;
  name?: string;
  avatar?: string;
  status?: 'online' | 'offline' | 'away';
}

export interface Message {
  _id: string;
  from: string;
  to: string;
  text: string;
  timestamp: Date;
}

export interface APIResponse<T> {
  data?: T;
  error?: string;
  status: number;
}