import { ORDER_MESSAGE } from "../constants/messages.js";
import reviews from "../models/schemas/Reviews.shema.js";
import ordersRepo from "../repositories/orders.repo.js";
import reviewRepo from "../repositories/reviews.repo.js";
import userRepo from "../repositories/users.repo.js";

const writeReview = async (reqBody) => {
    try {
        const { userID } = reqBody 
        if (!await userRepo.findById(userID)) {
            throw new Error(ORDER_MESSAGE.NO_PERMISSION)
        }
        const buyer = ordersRepo.getOrder
        const { reviewer, order_detail, content, create_at, star } = reqBody || {}

        const newdata = { reviewer, order_detail, content, create_at, star }
        // const filter = ['reviewer', 'order_detail', 'content', 'create_at', 'star']
        // const newReview = {
        //     ...Object.fromEntries(
        //         Object.entries(reqBody).filter(([key]) => filter.includes(key))
        //     )
        // } // use this when we've got more complicated DB
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