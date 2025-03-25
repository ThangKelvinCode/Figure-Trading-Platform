import orderDetailsRepo from "../repositories/orderDetail.repo.js"

const getDetailOfOrder = async (orderID) => {
    try {
        return await orderDetailsRepo.getAllDetailOfOrder(orderID)
    } catch (error) {
        throw new Error(error)
    }
}

const getDetail = async (detailID) => {
    try {
        return await orderDetailsRepo.getOrderDetails(detailID)
    } catch (error) {
        throw new Error(error)
    }
}
export const orderDetailsService = {
    getDetailOfOrder,
    getDetail
}