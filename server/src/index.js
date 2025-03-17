import express from 'express'
import cors from 'cors'
import { corsOptions } from './configs/cors.js'
import usersRouter from './routes/users.routers.js'
import { defaultErrorHandler } from './middlewares/error.middlewares.js'
import accessoriesRouter from './routes/accessories.routes.js'
import offersRouter from './routes/offers.routers.js'
import tradeRequestsRouter from './routes/tradeRequests.routers.js'
import { initFolder } from './utils/file.js'
import database from './configs/database.js'
import orderRoutes from './routes/orders.routes.js'
import swaggerUi from 'swagger-ui-express'
import swaggerFile from '../swagger-output.json' with { type: "json" }
import bodyParser from 'body-parser'

//dựng server
const app = express()

//cors
app.use(cors(corsOptions))

const port = 3000
//call server mongo chạy
database.connect()
initFolder()
app.use(express.json()) //cho server xài middleware biến đổi json
//cho server kết nối các Router
app.use(bodyParser.json())
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/user', usersRouter)

app.use('/accessories', accessoriesRouter)

app.use('/trade_requests', tradeRequestsRouter)

app.use('/offers', offersRouter)

app.use('/orders', orderRoutes)
//trở thành error handler cho cả app nên nó nằm cuối app để là điểm tập kết cuối cùng
//xử lí lỗi tổng
app.use(defaultErrorHandler)

//Cho server mở port ở 3000
app.listen(port, () => {
  console.log(`Project is running on port : ${port}`)
})