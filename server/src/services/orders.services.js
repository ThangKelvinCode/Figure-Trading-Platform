import { ORDER_MESSAGE } from "../constants/messages"
import ordersRepo from "../repositories/orders.repo"
import { usersServices } from "./users.services"

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

const setStatus = async (newStatus, orderID, adminID) => { // must be Admin
    try {
        if (usersServices.checkAdmin(adminID)) {
            return await ordersRepo.setStatus(newStatus, orderID)
        } else throw new Error(ORDER_MESSAGE.NO_PERMISSION)
    } catch (error) {
        throw new Error(error)
    }
}

export const orderServices = {
    createOrder,
    getAllOrders,
    getOrder,
    setStatus
}