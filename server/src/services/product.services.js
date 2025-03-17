// import { productModel } from '../models/productModel.js'
import productModel from '../models/productModel.js'

const postAccessories = async (reqBody) => {
  try {
    // process logic base on each project
    const newProduct = {
      ...reqBody
    }
    // call model layer to save into DB
    return await productModel.postAccessories(newProduct)
  } catch (error) {
    throw error
  }
}

const getAccessory = async (ID) => {
  try {
    return await productModel.getAccessory(ID)
  } catch (error) {
    throw error
  }
}

const deleteAccessory = async (ID) => {
  try {
    return await productModel.deleteAccessory(ID)
  } catch (error) {
    throw error
  }
}

const getAllAccessories = async () => {
  try {
    const list = await productModel.getAllAccessories()
    // console.log('service: ', list)
    return list
  } catch (error) {
    throw error
  }
}

const createCategories = async (reqBody) => {
  try {
    // process logic base on each project
    const { type } = reqBody
    const exist = await productModel.checkCatExistByType(type)
    if (exist) {
      throw new Error('Category already exists')
    } else {
      //no category exist
      const newCat = {
        ...reqBody
      }
      // call model layer to save into DB
      return await productModel.createCategories(newCat)
    }
  } catch (error) {
    throw error
  }
}

const getCategory = async (ID) => {
  try {
    return await productModel.getCategory(ID)
  } catch (error) {
    throw error
  }
}

const getAllCategories = async (ID) => {
  try {
    return await productModel.getAllCategories(ID)
  } catch (error) {
    throw error
  }
}

export const productServices = {
  postAccessories,
  createCategories,
  getAccessory,
  getCategory,
  getAllAccessories,
  getAllCategories,
  deleteAccessory
}
