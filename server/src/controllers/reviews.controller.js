import HTTP_STATUS from "../constants/httpStatus.js"
import { REVIEW_MESSAGE } from "../constants/messages.js"
import { reviewService } from "../services/reviews.services.js"
import { ORDER_MESSAGE } from "../constants/messages.js"

const writeReview = async (req, res) => {
    try {
        const newReview = await reviewService.writeReview(req.body, req.params.id, req.params.detailID)
        if(newReview ==  null){
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: ORDER_MESSAGE.NOT_COMPLETED
            })
        }
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
        const userID = req.params.id
        const reviewID = req.params.reviewID
        const result = await reviewService.editReview(req.body, userID, reviewID)
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
        const userID = req.params.id
        const reviewID = req.params.reviewID
        const del = await reviewService.deleteReview(userID, reviewID)

        return res.status(HTTP_STATUS.OK).json({
            message: REVIEW_MESSAGE.DELETE_SUCCESS,
            del
        })

    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({error: error.message})
    }
}

export const reviewsController = {
    editReview,
    getReview,
    deleteReview,
    writeReview
}