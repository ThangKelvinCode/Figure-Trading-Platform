import HTTP_STATUS from "../constants/httpStatus.js"
import { REVIEW_MESSAGE } from "../constants/messages.js"
import { reviewService } from "../services/reviews.services.js"

const writeReview = async (req, res) => {
    try {
        const newReview = await reviewService.writeReview(req.body)
        return res.status(HTTP_STATUS.CREATED).json({
            message: REVIEW_MESSAGE.CREATE_SUCCESS,
            newReview
        })
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error: error.message})
    }
}

const getReview = async(req, res) => {
    try {
        const result = reviewService.getReview(req.parmas.id) 
        return res.status(HTTP_STATUS.OK).json(result)
    } catch (error) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({error: error.message})
    }
}

const editReview = async(req, res) => {
    try {
        const { _id, content, star } = req.body || {}

        const result = await reviewService.editReview(star, content, _id)
        return res.status(HTTP_STATUS.OK).json({
            message: REVIEW_MESSAGE.UPDATE_SUCCESS,
            result
        })
    } catch (error) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({error: error.message})
    }
}

const deleteReview = async(req, res) => {
    try {
        const { userID } = req.body
        const del = reviewService.deleteReview(userID, req.parmas.id)
        return res.status(HTTP_STATUS.OK).json({
            message: REVIEW_MESSAGE.DELETE_SUCCESS,
            del
        })
    } catch (error) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({error: error.message})
    }
}

export const reviewsController = {
    editReview,
    getReview,
    deleteReview,
    writeReview
}