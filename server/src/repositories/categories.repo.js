import { ObjectId } from 'mongodb'
import database from '../configs/database.js'
import dotenv from 'dotenv'

dotenv.config()

class CategoriesRepo {
    constructor() {
        this.db = database.db.collection(process.env.DB_CATEGORIES_COLLECTION)
    }

    async createCategories(data) {
        return await this.db.insertOne(data)
    }

    async getCategory(id) {
        return await this.db.findOne({ _id: new ObjectId(id) })
    }

    async getAllCategories() {
        return await this.db.find().toArray()
    }

    async deleteCategoryByID(id) {
        return await this.db.deleteOne({ _id: new ObjectId(id) })
    }

    async checkCatExistByType(type) {
        return Boolean(await this.db.findOne({ type }))
    }
}

const categoriesRepo = new CategoriesRepo()

export default categoriesRepo