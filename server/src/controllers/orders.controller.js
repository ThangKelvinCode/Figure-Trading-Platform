import HTTP_STATUS from "../constants/httpStatus.js"
import { ORDER_STATUS } from "../constants/orderStatus.js"
import { orderServices } from "../services/orders.services.js"

const getAllUserOrder = async (req, res) => {
    try {
        const orderList = await orderServices.getAllUserOrder(req.params.id)
        return res.status(HTTP_STATUS.OK).json({
            orderList
        })
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error: error.message})
    }
}

const setStatus = async (req, res) => {
    try {
        const newStatusNumber = req.body.newStatus

        const newStatus = ORDER_STATUS[newStatusNumber]

        const updatedStatus = await orderServices.setStatus(newStatus, req.params)

        res.status(HTTP_STATUS.OK).json({ newStatus: newStatus})
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
}

export const ordersController = {
    getAllUserOrder,
    setStatus
}