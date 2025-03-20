import express from 'express'
import cors from 'cors' // Import cors
import { createServer } from 'http'; // Để tạo server HTTP
import usersRouter from './routes/users.routers.js'
import { defaultErrorHandler } from './middlewares/error.middlewares.js'
import accessoriesRouter from './routes/accessories.routes.js'
import offersRouter from './routes/offers.routers.js'
import tradeRequestsRouter from './routes/tradeRequests.routers.js'
import { initFolder } from './utils/file.js'
import database from './configs/database.js'
import swaggerUi from 'swagger-ui-express'
import messagesRouter from './routes/messages.routes.js';
import { messagesServices } from './services/messages.services.js';
import bodyParser from 'body-parser';
import swaggerFile from '../swagger-output.json' assert { type: "json" }
import { Server } from 'socket.io';

//dựng server
const app = express()
const port = 3000

const server = createServer(app);

// Tích hợp Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true // Nếu dùng cookie hoặc token trong request
  },
});

// Connect to database
database.connect()
initFolder()

app.use(express.json()) 

app.use(cors({
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}))

// Enable JSON middleware
app.use(express.json())
app.use(bodyParser.json())

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Setup routes
app.use('/user', usersRouter)
app.use('/accessories', accessoriesRouter)
app.use('/offer', offersRouter)
app.use('/trade_requests', tradeRequestsRouter);
app.use('/messages', messagesRouter);


app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`);
  next();
});

// Error handling middleware (should be at the end)
app.use(defaultErrorHandler)

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // socket.on('join_user_room', (userId) => {
  //   socket.join(userId);
  //   console.log(`User ${socket.id} joined room ${userId}`);
  // });

  // Trader tham gia vào một phòng chat (dựa trên tradeId)
  socket.on('join_trade', (tradeId) => {
    socket.join(tradeId);
    console.log(`User ${socket.id} joined trade ${tradeId}`);
  });

  // Xử lý gửi tin nhắn
  socket.on('send_message', async (data) => {
    console.log('Received send_message:', data);
    try {
      const { tradeId, senderId, receiverId, message } = data;
      const newMessage = await messagesServices.sendMessage({
        tradeId,
        senderId,
        receiverId,
        message,
      });
      console.log('Sending receive_message to trade:', tradeId, newMessage);
      io.to(tradeId).emit('receive_message', newMessage);
    } catch (error) {
      console.error('Error handling send_message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Khởi động server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});