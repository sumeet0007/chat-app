import { Server } from 'socket.io';
import http from 'http';

const port = Number(process.env.PORT) || 3001;
const host = '0.0.0.0';

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: 'https://chat-lab-green.vercel.app/',
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

server.listen(port, host, () => {
  console.log(`✅ Socket server running at http://${host}:${port}`);
});

export default io;