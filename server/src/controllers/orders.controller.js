import HTTP_STATUS from "../constants/httpStatus.js"
import { orderServices } from "../services/orders.services.js"
import { reviewService } from "../services/reviews.services.js"

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

// const writeReview = async (req, res) => {
//     try {
//         const review = await reviewService.writeReview(req.body, req.params.id, req.params.detailID)         
//         return res.status(HTTP_STATUS.CREATED).json({
//             review
//         })
//     } catch (error) {
//         return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error: error.message})
//     }
// }

export const ordersController = {
    getAllUserOrder
    // writeReview
}