import { Router } from "express"
import { reviewsController } from "../controllers/reviews.controller.js"

const orderRoutes = Router()

orderRoutes.get('/allOrders')

export default orderRoutes

