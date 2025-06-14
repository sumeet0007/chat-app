// socket-server/index.ts
import { Server } from 'socket.io';
import http from 'http';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send-message', (msg) => {
    console.log('Received message:', msg);
    io.emit('receive-message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(3001, () => {
  console.log('Socket server running on http://localhost:3001');
});
