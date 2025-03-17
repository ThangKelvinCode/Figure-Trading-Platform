import express from 'express'
import usersRouter from './routes/users.routers.js'
import { defaultErrorHandler } from './middlewares/error.middlewares.js'
import accessoriesRouter from './routes/accessories.routes.js'
import offersRouter from './routes/offers.routers.js'
import tradeRequestsRouter from './routes/tradeRequests.routers.js'
import { initFolder } from './utils/file.js'
import database from './configs/database.js'
import paymentRouter from './routes/payments.routers.js'

console.log(Date.now().toString())
// console.log(new Date().toISOString())
//dựng server
const app = express()
const port = 3000
//call server mongo chạy
database.connect()
initFolder()
app.use(express.json()) //cho server xài middleware biến đổi json
//cho server kết nối các Router
// app.use('/', console.log('Hello World'))

app.use('/user', usersRouter)

app.use('/accessories', accessoriesRouter)

app.use('/trade-requests', tradeRequestsRouter)

app.use('/offers', offersRouter)

app.use('/payment', paymentRouter)

//trở thành error handler cho cả app nên nó nằm cuối app để là điểm tập kết cuối cùng
//xử lí lỗi tổng
app.use(defaultErrorHandler)

//Cho server mở port ở 3000
app.listen(port, () => {
  console.log(`Project is running on port : ${port}`)
})
