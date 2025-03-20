import express from 'express'
import { Router } from 'express'
import { loginValidator, registerValidator } from '../middlewares/users.middlewares.js'
import { userController } from '../controllers/users.controllers.js'
import { wrapAsync } from '../utils/handler.js'
import { verifyToken } from '../middlewares/auth.middlewares.js'
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
      #swagger.responses[200] = {
        description: "User registered successfully",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                message: { type: "string", example: "Register Successfully" },
                id: { type: "string", example: "67d52b3c60c67cabfd83d7fd" }
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
                refresh_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
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
  verifyToken,
  wrapAsync(userController.getUserProfile)
);

export default usersRouter