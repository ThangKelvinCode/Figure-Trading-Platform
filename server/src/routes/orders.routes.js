import { Router } from "express"
import { reviewsController } from "../controllers/reviews.controller.js"
import { ordersController } from "../controllers/orders.controller.js" 

const orderRoutes = Router({ mergeParams: true })

orderRoutes.get('/allOrders', ordersController.getAllUserOrder)

// orderRoutes.post('/:orderID/', reviewsController.writeReview)

orderRoutes.post('/:detailID/writeReview', reviewsController.writeReview)

export default orderRoutes

