import { Server } from 'socket.io';
import http from 'http';

const port = process.env.PORT || 3001;
const host = '0.0.0.0'; // ✅ Required by Render

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: 'https://chat-lab-green.vercel.app', // your Vercel frontend URL
    methods: ['GET', 'POST'],
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

server.listen(port, Number(host), () => {
  console.log(`✅ Socket server running at http://${host}:${port}`);
});
