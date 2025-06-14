// app/lib/socket.ts
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001', {
  autoConnect: false, // so you control when it connects
  transports: ['websocket', 'polling'], // Try both transport methods
});

// Add connection event listeners for debugging
socket.on('connect', () => {
  console.log('Socket connected!', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

export default socket;
