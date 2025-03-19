import { ObjectId } from "mongodb"
import database from "../configs/database.js"
import dotenv from 'dotenv'

dotenv.config()

class OrderDetailsRepo {
    constructor() {
        this.db = database.db.collection(process.env.DB_ORDER_DETAILS_COLLECTION)
    }

    async createOrdersDetail(order) {
        return await this.db.insertOne(order)
    }

    async getAllOrderDetails() {
        return await this.db.find().toArray()
    }

    async getOrderDetails(id) {
        return await this.db.findOne({ _id: new ObjectId(id)})
    }

}

const orderDetailsRepo = new OrderDetailsRepo()

export default orderDetailsRepo