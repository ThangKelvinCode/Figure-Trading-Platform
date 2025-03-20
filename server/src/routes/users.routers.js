import express from 'express'
import { Router } from 'express'
import { loginValidator, registerValidator } from '../middlewares/users.middlewares.js'
import { userController } from '../controllers/users.controllers.js'
import { wrapAsync } from '../utils/handler.js'
import orderRoutes from './orders.routes.js'
//tạo Router
const usersRouter = Router()

usersRouter.post(
  '/register',
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Register a new user'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["name", "email", "password", "confirmed_password", "date_of_birth"],
              properties: {
                name: { type: "string", example: "mailx2" },
                email: { type: "string", format: "email", example: "mai12435@gmail.com" },
                password: { type: "string", format: "password", example: "1234@Mai" },
                confirmed_password: { type: "string", format: "password", example: "1234@Mai" },
                date_of_birth: { type: "string", format: "date-time", example: "2025-03-15T11:58:32Z" }
              }
            }
          }
        }
      }
    */
  registerValidator,
  wrapAsync(userController.register)
)

usersRouter.post(
  '/login',
  /*  #swagger.tags = ['Users']
      #swagger.description = 'User login'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email", example: "mai12435@gmail.com" },
                password: { type: "string", format: "password", example: "1234@Mai" },
              }
            }
          }
        }
      }
    */
  loginValidator,
  wrapAsync(userController.login)
)

usersRouter.get(
  '/:id',
  /*  #swagger.tags = ['Users']
        #swagger.summary = 'Get user profile'
        #swagger.description = 'Retrieves the profile details of a specific user by their ID'
        #swagger.parameters['id'] = { 
            description: "User ID", 
            type: "string", 
            required: true, 
            example: "67af6d45efd963779dfa5f84" 
        }
        #swagger.responses[200] = { 
            description: "User profile retrieved successfully",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            id: { type: "string", example: "67af6d45efd963779dfa5f84" },
                            name: { type: "string", example: "John Doe" },
                            email: { type: "string", example: "john.doe@example.com" },
                            role: { type: "string", example: "customer" },
                            createdAt: { type: "string", format: "date-time", example: "2025-03-19T12:00:00Z" }
                        }
                    }
                }
            }
        }
        #swagger.responses[404] = { description: "User not found" }
    */
  wrapAsync(userController.getUserProfile)
)

usersRouter.use('/:id/Orders', orderRoutes)

export default usersRouter
