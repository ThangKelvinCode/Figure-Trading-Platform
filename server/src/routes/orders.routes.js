import { Router } from "express"
import { reviewsController } from "../controllers/reviews.controller.js"
import { ordersController } from "../controllers/orders.controller.js" 

const orderRoutes = Router({ mergeParams: true })

orderRoutes.get('/allOrders', ordersController.getAllUserOrder)

export default orderRoutes

