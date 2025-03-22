import { ORDER_MESSAGE } from "../constants/messages.js";
import ORDER_STATUS from "../constants/orderStatus.js";
import reviews from "../models/schemas/Reviews.shema.js";
import orderDetailsRepo from "../repositories/orderDetail.repo.js";
import ordersRepo from "../repositories/orders.repo.js";
import reviewRepo from "../repositories/reviews.repo.js";
import userRepo from "../repositories/users.repo.js";
import order_details from "../models/schemas/Order_Details.schema.js";
import orders from "../models/schemas/Orders.schema.js";   
import { ObjectId } from "mongodb";
const writeReview = async (reqBody, userID, detailID) => {
    try {
        if (!await userRepo.findById(userID)) {
            throw new Error(ORDER_MESSAGE.NO_PERMISSION)
        }
        const orderDetail = new order_details(await orderDetailsRepo.getOrderDetails(detailID))
        console.log(orderDetail) //done
        const order = new orders(await ordersRepo.getOrder(orderDetail.order))
        // console.log(userID) //done
        console.log(order.status)
        console.log(order._id)
        if(order.status !== ORDER_STATUS.COMPLETED){
            return null
        }
        const newdata = {
            ...reqBody, // content rate and content
            reviewer: new ObjectId(userID),
            order_detail: new ObjectId(detailID)
        }
        const newReview = new reviews(newdata)
        return await reviewRepo.writeReview(newReview)
    } catch (error) {
        throw new Error(error.message)
    }
}

const getReview = async (id) => {
    try {
        return await reviewRepo.getReview(id)
    } catch (error) {
        throw new Error(error.message)
    }
}

const editReview = async (star, content, id) => {
    if (!await getReview(id)) {
        throw new Error(ORDER_MESSAGE.NOT_FOUND)
    }
    return await reviewRepo.editReview(star, content, id)
}

const deleteReview = async (userID, reviewID) => {
    if (await userRepo.findById(userID)) {
        throw new Error(ORDER_MESSAGE.NO_PERMISSION)
    }
    return await reviewRepo.deleteReview(reviewID)
}

export const reviewService = {
    getReview,
    editReview,
    writeReview,
    deleteReview
}