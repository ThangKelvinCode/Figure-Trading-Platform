import { productServices } from "../services/product.services.js"
import HTTP_STATUS from '../constants/httpStatus.js'

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
    res.status(HTTP_STATUS.OK).json(accessory)
}

const deleteAccessory = async (req, res) => {
    const del = await productServices.deleteAccessory(req.params.id)
    res.status(HTTP_STATUS.OK).json(del)
    
}

const getAllCategories = async (req, res) => {
    const categoryList = await productServices.getAllCategories()
    res.status(HTTP_STATUS.OK).json(categoryList)
}

const getCategory = async (req, res) => {
    const category = await productServices.getAllCategories(req.params.id)
    res.status(HTTP_STATUS.OK).json(category)
}
export const accessoriesController = {
    postAccessories,
    newCategory,
    getAccessory,
    getCategory,
    getAllAccessories,
    getAllCategories,
    deleteAccessory
}