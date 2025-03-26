import { ORDER_MESSAGE, USERS_MESSAGES } from "../constants/messages.js"
import ordersRepo from "../repositories/orders.repo.js"
import userRepo from "../repositories/users.repo.js"
import { orderDetailsService } from "./orderDetails.services.js"
import { usersServices } from "./users.services.js"

const createOrder = async (reqBody) => {
    try {
        const newOder = {
            ...reqBody
        }
        return await ordersRepo.createOrder(newOder)
    } catch (error) {
        throw new Error(error)
    }
}

const getAllOrders = async () => {
    try {
        return await ordersRepo.getAllOrders()
    } catch (error) {
        throw new Error(error)
    }
}

const getOrder = async (id) => {
    try {
        return await ordersRepo.getOrder(id)
    } catch (error) {
        throw new Error(error)
    }
}

const setStatus = async (newStatus, orderID) => {
    try {
        return await ordersRepo.setStatus(newStatus, orderID)
    } catch (error) {
        throw new Error(error)
    }
}

const getAllUserOrder = async (buyerID) => {
    try {
        const user = await userRepo.findById(buyerID)
        if (!user) {
            throw new Error(USERS_MESSAGES.USER_NOT_FOUND)
        }
        const orders = await ordersRepo.getAllUserOrders(buyerID)
        const fullOrders = await Promise.all(
            orders.map(async (order) => {
                const orderDetails = await orderDetailsService.getDetailOfOrder(order._id);
                return {
                    ...order,
                    details: orderDetails, // Attach order details
                }
            })
        )
        return fullOrders
    } catch (error) {
        throw new Error(error)
    }
}

export const orderServices = {
    createOrder,
    getAllOrders,
    getOrder,
    setStatus,
    getAllUserOrder
}