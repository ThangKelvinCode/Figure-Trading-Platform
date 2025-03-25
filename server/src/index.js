import express from 'express'
import cors from 'cors' // Import cors (giữ 1 dòng, loại trùng lặp từ backend)
import { createServer } from 'http' // Để tạo server HTTP (chỉ có ở trade-flow, giữ lại)
import { corsOptions } from './configs/cors.js' // Chỉ có ở backend, giữ lại
import usersRouter from './routes/users.routers.js'
import { defaultErrorHandler } from './middlewares/error.middlewares.js'
import accessoriesRouter from './routes/accessories.routes.js'
import offersRouter from './routes/offers.routers.js'
import tradeRequestsRouter from './routes/tradeRequests.routers.js'
import { initFolder } from './utils/file.js'
import database from './configs/database.js'
import YAML from 'yaml' // Chỉ có ở trade-flow, giữ lại
import swaggerUi from 'swagger-ui-express' // Có ở cả hai, giữ 1 dòng
import swaggerJsdocOSA from 'swagger-jsdoc' // Chỉ có ở trade-flow, giữ lại (tên biến đổi để tránh nhầm lẫn)
import messagesRouter from './routes/messages.routes.js' // Chỉ có ở trade-flow, giữ lại
import { messagesServices } from './services/messages.services.js' // Chỉ có ở trade-flow, giữ lại
import bodyParser from 'body-parser' // Có ở cả hai, giữ 1 dòng
import swaggerFile from '../swagger-output.json' with { type: 'json' } // Có ở cả hai nhưng cú pháp khác nhau, giữ từ trade-flow
import { Server } from 'socket.io' // Chỉ có ở trade-flow, giữ lại
import orderRoutes from './routes/orders.routes.js' // Chỉ có ở backend, giữ lại
import paymentRouter from './routes/payments.routers.js' // Chỉ có ở backend, giữ lại

// Dựng server
const app = express()

// Cors
app.use(cors(corsOptions)) // Giữ từ backend, loại dòng cors đơn giản từ trade-flow

const port = 3000

const server = createServer(app) // Chỉ có ở trade-flow, giữ lại

// Tích hợp Socket.IO
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // URL frontend React của bạn (thay đổi nếu cần)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true // Nếu dùng cookie hoặc token trong request
  }
})

// Connect to database
database.connect()
initFolder()

app.use(express.json()) // Có ở cả hai, giữ 1 dòng
app.use(bodyParser.json()) // Có ở cả hai, giữ 1 dòng
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile)) // Có ở cả hai, giữ 1 dòng

// Setup routes
app.use('/user', usersRouter)
app.use('/accessories', accessoriesRouter)
app.use('/offer', offersRouter) // Từ trade-flow
app.use('/trade_requests', tradeRequestsRouter) // Có ở cả hai nhưng khác tên route, giữ cả hai
app.use('/orders', orderRoutes) // Chỉ có ở backend
app.use('/payment', paymentRouter) // Chỉ có ở backend
app.use('/messages', messagesRouter) // Chỉ có ở trade-flow

app.use((req, res, next) => {
  console.log(`Received ${req.method} request at ${req.url}`)
  next()
})

// Trở thành error handler cho cả app nên nó nằm cuối app để là điểm tập kết cuối cùng
app.use(defaultErrorHandler)

// Tạm thời để Socket.IO logic ở đây (sẽ tách sau)
// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)

  // Trader tham gia vào một phòng chat (dựa trên tradeId)
  socket.on('join_trade', (tradeId) => {
    socket.join(tradeId)
    console.log(`User ${socket.id} joined trade ${tradeId}`)
  })

  // Xử lý gửi tin nhắn
  socket.on('send_message', async (data) => {
    console.log('Received send_message:', data)
    try {
      const { tradeId, senderId, receiverId, message } = data
      const newMessage = await messagesServices.sendMessage({
        tradeId,
        senderId,
        receiverId,
        message
      })
      console.log('Sending receive_message to trade:', tradeId, newMessage)
      io.to(tradeId).emit('receive_message', newMessage)
    } catch (error) {
      console.error('Error handling send_message:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})

// Khởi động server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
