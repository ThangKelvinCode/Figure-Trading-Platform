import express from 'express'
import { Router } from 'express'
import { loginValidator, registerValidator } from '../middlewares/users.middlewares.js'
import { userController } from '../controllers/users.controllers.js'
import { wrapAsync } from '../utils/handler.js'
//tạo Router
const usersRouter = Router()

/*
    description: Register a new user
    path: /register
    method: POST
    body: {
        name: string,
        email: string,
        password: string,
        confirm_password: string,
        date_of_birth: string nhưng có dạng ISO8601
    }
 */
usersRouter.post('/register', registerValidator, wrapAsync(userController.register))

/*
    description: Login
    path: /login
    method: POST
    body: {
        email: string,
        password: string
    }
*/
usersRouter.post('/login', loginValidator, wrapAsync(userController.login))

/*
    description: view profile
    path: /:id
    method: GET
*/
usersRouter.get('/:id', wrapAsync(userController.getUserProfile))

export default usersRouter
