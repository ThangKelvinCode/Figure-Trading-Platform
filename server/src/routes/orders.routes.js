import { Router } from "express"
import { reviewsController } from "../controllers/reviews.controller.js"
import { ordersController } from "../controllers/orders.controller.js" 
import { verifyToken } from "../middlewares/auth.middlewares.js";

const orderRoutes = Router({ mergeParams: true })
orderRoutes.use(verifyToken);

orderRoutes.get(
    '/allOrders',
    /*  #swagger.tags = ['Orders']
          #swagger.summary = 'Get all orders for a user'
          #swagger.description = 'Retrieves all orders placed by the user'
          #swagger.responses[200] = { 
              description: "Orders retrieved successfully",
              content: {
                  "application/json": {
                      schema: {
                          type: "array",
                          items: {
                              type: "object",
                              properties: {
                                  order_id: { type: "string", example: "67d47099b5a8da11c7804a7d" },
                                  total_price: { type: "number", example: 49.99 },
                                  status: { type: "string", example: "Delivered" },
                                  createdAt: { type: "string", format: "date-time", example: "2025-03-19T14:00:00Z" }
                              }
                          }
                      }
                  }
              }
          }
          #swagger.responses[404] = { description: "No orders found for the user" }
      */
    ordersController.getAllUserOrder
  )
  
  orderRoutes.post(
    '/:detailID/writeReview',
    /*  #swagger.tags = ['Reviews']
          #swagger.summary = 'Write a review for an order detail'
          #swagger.description = 'Allows a user to submit a review for a specific order detail'
          #swagger.parameters['detailID'] = { 
              description: "Order Detail ID", 
              type: "string", 
              required: true, 
              example: "67dfcb5138afc23bf8cff336" 
          }
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          type: "object",
                          required: ["content", "star"],
                          properties: {
                              content: { type: "string", example: "This product is very good, well fit." },
                              star: { type: "integer", example: 5 }
                          }
                      }
                  }
              }
          }
          #swagger.responses[201] = { description: "Review submitted successfully" }
          #swagger.responses[400] = { description: "Invalid review submission" }
      */
    reviewsController.writeReview
  )
  
  orderRoutes.delete(
    '/review/:reviewID/delete',
    /*  #swagger.tags = ['Reviews']
          #swagger.summary = 'Delete a review'
          #swagger.description = 'Deletes a review based on review ID'
          #swagger.parameters['reviewID'] = { 
              description: "Review ID", 
              type: "string", 
              required: true, 
              example: "67dfbeea2fb93c43002e5fa6" 
          }
          #swagger.responses[200] = { description: "Review deleted successfully" }
          #swagger.responses[404] = { description: "Review not found" }
      */
    reviewsController.deleteReview
  )
  
  orderRoutes.post(
    '/review/:reviewID/edit',
    /*  #swagger.tags = ['Reviews']
          #swagger.summary = 'Edit a review'
          #swagger.description = 'Allows a user to edit their review based on the review ID'
          #swagger.parameters['reviewID'] = { 
              description: "Review ID", 
              type: "string", 
              required: true, 
              example: "67dfcb5138afc23bf8cff336" 
          }
          #swagger.requestBody = {
              required: true,
              content: {
                  "application/json": {
                      schema: {
                          type: "object",
                          required: ["content", "star"],
                          properties: {
                              content: { type: "string", example: "This product is very good, well fit." },
                              star: { type: "integer", example: 4 }
                          }
                      }
                  }
              }
          }
          #swagger.responses[200] = { description: "Review updated successfully" }
          #swagger.responses[404] = { description: "Review not found" }
      */
    reviewsController.editReview
  )
  orderRoutes.post('/:id/updateStatus', ordersController.setStatus)
export default orderRoutes