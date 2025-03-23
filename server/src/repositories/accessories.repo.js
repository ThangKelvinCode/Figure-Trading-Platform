import { ObjectId } from 'mongodb'
import database from '../configs/database.js'
import dotenv from 'dotenv'

dotenv.config()

class AccessoriesRepo {
    constructor() {
        this.db = database.db.collection(process.env.DB_ACCESSORIES_COLLECTION)
    }

    async postAccessories(data) {
        return await this.db.insertOne(data)
    }

    async getAccessorybyID(id) {
        return await this.db.findOne({ _id: new ObjectId(id) })
    }

    async getAllAccessories() {
        return await this.db.find().toArray()
    }

    async deleteAccessoryByID(id) {
        return await this.db.deleteOne({ _id: new ObjectId(id) })
    }
}

const accessoriesRepo = new AccessoriesRepo()

export default accessoriesRepo