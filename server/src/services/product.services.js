import accessoriesRepo from '../repositories/accessories.repo.js'
import categoriesRepo from '../repositories/categories.repo.js'

const postAccessories = async (reqBody) => {
  try {
    // process logic base on each project
    const newProduct = {
      ...reqBody
    }
    // call model layer to save into DB
    return await accessoriesRepo.postAccessories(newProduct)
  } catch (error) { throw error }
}

const getAccessory = async(ID) => {
  try {
    return await accessoriesRepo.getAccessorybyID(ID)
  } catch (error) {
    throw error
  }
}

const deleteAccessory = async(ID) => {
  try {
    return await accessoriesRepo.deleteAccessoryByID(ID)
  } catch (error) {
    throw error
  }
}

const getAllAccessories = async() => {
  try {
    const list = await accessoriesRepo.getAllAccessories()
    // console.log('service: ', list)
    return list
  } catch (error) {
    throw error
  }
}

const createCategories = async (reqBody) => {
  try {
    // process logic base on each project
    const { type }  = reqBody
    const exist = await categoriesRepo.checkCatExistByType(type)  
    if (exist) {
      throw new Error('Category already exists');
  } else { //no category exist
    const newCat = {
      ...reqBody
    }
    // call model layer to save into DB
    return await categoriesRepo.createCategories(newCat)
  }
  } catch (error) { throw error }
}

const getCategory = async(ID) => {
  try {
    return await categoriesRepo.getCategory(ID)
  } catch (error) {
    throw error
  }
}

const getAllCategories = async(ID) => {
  try {
    return await categoriesRepo.getAllCategories(ID)
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