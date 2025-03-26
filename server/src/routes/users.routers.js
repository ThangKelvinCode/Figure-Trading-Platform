import express from 'express'
import { Router } from 'express'
import { loginValidator, registerValidator } from '../middlewares/users.middlewares.js'
import { userController } from '../controllers/users.controllers.js'
import { wrapAsync } from '../utils/handler.js'
import { verifyToken } from '../middlewares/auth.middlewares.js'
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
      #swagger.responses[201] = {
        description: "User registered successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Register Successfully" },
                user_id: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                access_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                refresh_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                role: { type: "string", example: "user" } // Thêm role vào response
              }
            }
          }
        }
      }
      #swagger.responses[401] = {
        description: "Email already exists",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Email already exists" }
              }
            }
          }
        }
      }
  */
  registerValidator,
  wrapAsync(userController.register)
);

usersRouter.post(
  '/login',
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Login to the system'
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", format: "email", example: "mai12435@gmail.com" },
                password: { type: "string", format: "password", example: "1234@Mai" }
              }
            }
          }
        }
      }
      #swagger.responses[200] = {
        description: "User logged in successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Login Successfully" },
                user_id: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                access_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                refresh_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                role: { type: "string", example: "1" } // Thêm role vào response
              }
            }
          }
        }
      }
      #swagger.responses[422] = {
        description: "Email or password is incorrect",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Email or password is incorrect" }
              }
            }
          }
        }
      }
  */
  loginValidator,
  wrapAsync(userController.login)
);

usersRouter.get(
  '/:id',
  /*  #swagger.tags = ['Users']
      #swagger.description = 'View user profile by ID'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string',
        example: '67d52b3c60c67cabfd83d7fd'
      }
      #swagger.responses[200] = {
        description: "User profile retrieved successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "success" },
                user: {
                  type: "object",
                  properties: {
                    id: { type: "string", example: "67d52b3c60c67cabfd83d7fd" },
                    name: { type: "string", example: "mailx2" },
                    email: { type: "string", example: "mai12435@gmail.com" },
                    date_of_birth: { type: "string", format: "date-time", example: "2025-03-15T11:58:32Z" }
                  }
                }
              }
            }
          }
        }
      }
      #swagger.responses[401] = {
        description: "Unauthorized - Access token is required or invalid",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Access token is required" }
              }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Internal server error" }
              }
            }
          }
        }
      }
  */
  // verifyToken,
  wrapAsync(userController.getUserProfile)
);

usersRouter.use(
  '/:id/Orders',
  /*  #swagger.tags = ['Users', 'Orders']
        #swagger.summary = 'Get all orders for a user'
        #swagger.description = 'Retrieves a list of all orders placed by a specific user based on their ID'
        #swagger.parameters['id'] = { 
            description: "User ID", 
            type: "string", 
            required: true, 
            example: "67af6d45efd963779dfa5f84" 
        }
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
                                createdAt: { type: "string", format: "date-time", example: "2025-03-19T14:00:00Z" },
                                items: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            product_id: { type: "string", example: "67de65c697e0e4a9a6a33574" },
                                            name: { type: "string", example: "Wireless Mouse" },
                                            quantity: { type: "integer", example: 2 },
                                            price: { type: "number", example: 24.99 }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        #swagger.responses[404] = { description: "User not found or no orders available" }
    */
  orderRoutes
)

usersRouter.post(
  '/:id/shippingInfo',
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Get shipping information for a user by ID'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string',
        example: '67d52b3c60c67cabfd83d7fd'
      }
      #swagger.responses[200] = {
        description: "Shipping information retrieved successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "success" },
                user: {
                  type: "object",
                  properties: {
                    name: { type: "string", example: "mailx2" },
                    email: { type: "string", example: "mai12435@gmail.com" },
                    phoneNumber: { type: "string", example: "02156423" },
                    address: { type: "string", example: "NVH SV,VN" }
                  }
                }
              }
            }
          }
        }
      }
      #swagger.responses[401] = {
        description: "Unauthorized - Access token is required or invalid",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Access token is required" }
              }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Internal server error" }
              }
            }
          }
        }
      }
  */
  wrapAsync(userController.getShipInfo)
)

usersRouter.put(
  '/:id/updateShippingInfo',
  /*  #swagger.tags = ['Users']
      #swagger.description = 'Update shipping information for a user by ID'
      #swagger.security = [{ "BearerAuth": [] }]
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string',
        example: '67d52b3c60c67cabfd83d7fd'
      }
      #swagger.requestBody = {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                phoneNumber: { type: "string", example: "02156423" },
                address: { type: "string", example: "NVH SV,VN" }
              }
            }
          }
        }
      }
      #swagger.responses[200] = {
        description: "Shipping information updated successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Added address successfully" },
                shipInfo: { type: "object", example: {} }
              }
            }
          }
        }
      }
      #swagger.responses[401] = {
        description: "Unauthorized - Access token is required or invalid",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Access token is required" }
              }
            }
          }
        }
      }
      #swagger.responses[500] = {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Internal server error" }
              }
            }
          }
        }
      }
  */
  wrapAsync(userController.updateShipInfo)
)

export default usersRouter