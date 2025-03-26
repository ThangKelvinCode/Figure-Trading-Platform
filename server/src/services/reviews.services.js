import { ORDER_MESSAGE } from "../constants/messages.js";
import { ORDER_STATUS } from "../constants/orderStatus.js";
import reviews from "../models/schemas/Reviews.shema.js";
import orderDetailsRepo from "../repositories/orderDetail.repo.js";
import ordersRepo from "../repositories/orders.repo.js";
import reviewRepo from "../repositories/reviews.repo.js";
import userRepo from "../repositories/users.repo.js";
import order_details from "../models/schemas/Order_Details.schema.js";
import orders from "../models/schemas/Orders.schema.js";
import { ObjectId } from "mongodb";
import { usersServices } from "./users.services.js";

const writeReview = async (reqBody, userID, detailID) => {
    try {
        if (!await userRepo.findById(userID)) {
            throw new Error(ORDER_MESSAGE.NO_PERMISSION)
        }
        const orderDetail = new order_details(await orderDetailsRepo.getOrderDetails(detailID))

        const order = new orders(await ordersRepo.getOrder(orderDetail.order))

        if (order.status !== ORDER_STATUS[6]) {
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

const editReview = async (reqBody, userID, reviewID) => {
    try {
        const review = new reviews(await getReview(reviewID))
        if (!review) {
            throw new Error(ORDER_MESSAGE.NOT_FOUND)
        }
    
        if (userID != review.reviewer) { //check if the edit person and reviewer is the same person
            throw new Error(ORDER_MESSAGE.NO_PERMISSION)
        }
    
        const { star, content} = reqBody
    
        return await reviewRepo.editReview(star, content, reviewID)
    } catch (error) {
        throw new Error(error.message)
    }
}

const deleteReview = async (userID, reviewID) => {
    try {
        const review = new reviews(await getReview(reviewID))
        console.log(review)// k phai tai nay
        if (!review) {
            throw new Error(ORDER_MESSAGE.NOT_FOUND)
        }
        if (userID == await review.reviewer || await usersServices.checkAdmin(userID)) {
            //check if the delete person and reviewer is the same person or must be admin
            return await reviewRepo.deleteReview(reviewID)
        }
        throw new Error(ORDER_MESSAGE.NO_PERMISSION)
    } catch (error) {
        throw new Error(error.message)
    }
}

export const reviewService = {
    getReview,
    editReview,
    writeReview,
    deleteReview
}