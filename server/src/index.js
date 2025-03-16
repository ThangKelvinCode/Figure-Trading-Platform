import express from 'express'
import cors from 'cors' // Import cors
import { createServer } from 'http'; // Để tạo server HTTP
import { Server } from 'socket.io'; // Socket.IO server
import usersRouter from './routes/users.routers.js'
import databaseServices from './services/database.services.js'
import { defaultErrorHandler } from './middlewares/error.middlewares.js'
import accessoriesRouter from './routes/accessories.routes.js'
import offersRouter from './routes/offers.routers.js'
import tradeRequestsRouter from './routes/tradeRequests.routers.js'
import { initFolder } from './utils/file.js'
import database from './configs/database.js'

import YAML from 'yaml'
// import fs from 'fs'
import swaggerUi from 'swagger-ui-express'
import swaggerJsdoc from 'swagger-jsdoc'
import messagesRouter from './routes/messages.routes.js';
import { messagesServices } from './services/messages.services.js';
// import path from 'path'


// const file  = fs.readFileSync(path.resolve('swd-swagger.yaml'), 'utf8')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Accessories Buying And Blindbox Trading',
      version: '1.0.0',
    },

    // components: {
    //   securitySchemes: {
    //     BearerAuth: {
    //       type: 'http',
    //       scheme: 'bearer',
    //       bearerFormat: 'JWT'
    //     }
    //   }
    // }
  },
  // apis: ['./src/routes/*.routers.js', './src/models/schemas/*.schema.js'], // files containing annotations as above
  // apis: ['./swd-swagger.yaml'], // files containing annotations as above
  apis: ['./openapi/*.yaml'], // files containing annotations as above
};
const openapiSpecification = swaggerJsdoc(options);

// const swaggerDocument = YAML.parse(file)



const app = express()
const port = 3000

const server = createServer(app);

// Tích hợp Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // URL frontend React của bạn (thay đổi nếu cần)
    methods: ['GET', 'POST'],
  },
});

// Connect to database
database.connect()
initFolder()

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins (for testing). Change this to your frontend URL in production.
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
}))

// Enable JSON middleware
app.use(express.json())

// const openapiSpecification = './swagger-output.json';
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Serve Swagger UI
// const swaggerDocument = require('./swagger-output.json'); // Đường dẫn đến tệp JSON
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

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

// Tạm thời để Socket.IO logic ở đây (sẽ tách sau)
// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

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