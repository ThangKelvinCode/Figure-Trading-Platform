import express from 'express'
import { Router } from 'express'
import { loginValidator, registerValidator } from '../middlewares/users.middlewares.js'
import { userController } from '../controllers/users.controllers.js'
import { wrapAsync } from '../utils/handler.js'
//tạo Router
const usersRouter = Router()

usersRouter.post('/register',
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
    registerValidator, wrapAsync(userController.register)
  )

usersRouter.post('/login',
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
  loginValidator, wrapAsync(userController.login))

usersRouter.get('/:id', wrapAsync(userController.getUserProfile))

export default usersRouter
