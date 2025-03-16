import { productServices } from "../services/product.services.js"
import HTTP_STATUS from '../constants/httpStatus.js'
import { usersServices } from "../services/users.services.js"
import { ORDER_MESSAGE } from "../constants/messages.js"
import { reviewService } from "../services/reviews.services.js"

const postAccessories = async (req, res) => {
    const posted = await productServices.postAccessories(req.body)
    res.status(HTTP_STATUS.CREATED).json(posted)
}

const newCategory = async (req, res) => {
    const newCategory = await productServices.createCategories(req.body)
    res.status(HTTP_STATUS.CREATED).json(newCategory)
}

const getAllAccessories = async (req, res) => {
    const accessoryList = await productServices.getAllAccessories()
    // console.log('controller: ', accessoryList)
    res.status(HTTP_STATUS.OK).json(accessoryList)
}

const getAccessory = async (req, res) => {
    const accessory = await productServices.getAccessory(req.params.id)
    const reviewList = await productServices.getAllReview(req.params.id)
    
    res.status(HTTP_STATUS.OK).json({
        accessory,
        reviewList
    })
}

const deleteAccessory = async (req, res) => {
    const del = await productServices.deleteAccessory(req.params.id)
    res.status(HTTP_STATUS.OK).json({
        message: ORDER_MESSAGE.DELETE_SUCCESS,
        del
    })
}

const getAllCategories = async (req, res) => {
    const categoryList = await productServices.getAllCategories()
    res.status(HTTP_STATUS.OK).json(categoryList)
}

const getCategory = async (req, res) => {
    const category = await productServices.getCategory(req.params.id)
    res.status(HTTP_STATUS.OK).json(category)
}

const getAllReview = async (req, res) => {
    try {
        const reviewList = await productServices.getAllReview(req.params.id)
        if (!reviewList.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ error: ORDER_MESSAGE.NOT_FOUND })
        }
        return res.status(HTTP_STATUS.OK).json(reviewList)
    } catch (error) {
        return res.status(HTTP_STATUS.SERVER_ERROR).json({ error: error.message })
    }
}

// const buyAccessory = async (req, res) => {
//     try {
//         const newOrder = await productServices.buyAccessory(req.body, req.params.id)
//         return res.status(HTTP_STATUS.CREATED).json({
//             message: ORDER_MESSAGE.CREATED,
//             newOrder
//         })
//     } catch (error) {
//         return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message })
//     }
// }

const buyAccessory = async (req, res) => {
    try {
      const newOrder = await productServices.buyAccessory(req.body, req.params.id)
  
      return res.status(HTTP_STATUS.CREATED).json({
        message: ORDER_MESSAGE.CREATED,
        result: newOrder
      })
  
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
  }

const writeReview = async(req, res) => {
    try {
        const newReview = await reviewService.writeReview(req.body)
        return res.status(HTTP_STATUS.CREATED).json({
            newReview
        })
    } catch (error) {
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message })
    }
}

export const accessoriesController = {
    postAccessories,
    newCategory,
    getAccessory,
    getCategory,
    getAllAccessories,
    getAllCategories,
    deleteAccessory,
    getAllReview,
    buyAccessory,
    writeReview
}