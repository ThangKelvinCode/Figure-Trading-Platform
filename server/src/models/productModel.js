import { ObjectId } from 'mongodb'
import database from '../configs/database.js'
import dotenv from 'dotenv'
dotenv.config()

class ProductModel {
  constructor() {
    this.db = database.db.collection(process.env.DB_ACCESSORIES_COLLECTION)
  }

  postAccessories = async (data) => {
    try {
      return await databaseServices.accessories.insertOne(data)
    } catch (error) {
      throw new Error(error)
    }
  }

  getAccessory = async (Acid) => {
    try {
      return await databaseServices.accessories.findOne({ _id: new ObjectId(Acid) })
    } catch (error) {
      throw new Error(error)
    }
  }

  getAllAccessories = async () => {
    try {
      return await databaseServices.accessories.find().toArray()
    } catch (error) {
      throw new Error(error)
    }
  }

  deleteAccessory = async (Acid) => {
    try {
      return await databaseServices.accessories.deleteOne({ _id: new ObjectId(Acid) })
    } catch (error) {
      throw new Error(error)
    }
  }

  createCategories = async (data) => {
    try {
      return await databaseServices.accessories_categories.insertOne(data)
    } catch (error) {
      throw new Error(error)
    }
  }

  getAllCategories = async () => {
    try {
      return await databaseServices.accessories_categories.find().toArray()
    } catch (error) {
      throw new Error(error)
    }
  }

  getCategory = async (Catid) => {
    try {
      return await databaseServices.accessories_categories.findOne({ _id: new ObjectId(Catid) })
    } catch (error) {
      throw new Error(error)
    }
  }

  checkCatExistByType = async (type) => {
    try {
      //exist = true
      return Boolean(await databaseServices.accessories_categories.findOne({ type }))
    } catch (error) {
      throw new Error(error)
    }
  }
}
const productModel = new ProductModel()
export default productModel
// = {
//     postAccessories,
//     createCategories,
//     getAccessory,
//     getAllCategories,
//     checkCatExistByType,
//     getCategory,
//     getAllAccessories,
//     deleteAccessory
// }
