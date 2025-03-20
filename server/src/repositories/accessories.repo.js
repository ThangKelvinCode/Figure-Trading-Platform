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

    async getAllReview(id) {
        const pipeline = [
            { $match: { _id: id } },
            {
                $lookup: {
                    from: 'order_details',
                    localField: '_id',
                    foreignField: 'accessories',
                    as: 'order_details'
                }
            },
            { $unwind: '$order_details' },
            {
                $lookup: {
                    from: 'reviews',
                    localField: 'order_details._id',
                    foreignField: 'order_detail',
                    as: 'reviews'
                }
            },
            { $unwind: '$reviews' },
            {
                $project: {
                    _id: 0,
                    review_id: '$reviews._id',
                    review_content: '$reviews.content',
                    create_at: '$reviews.create_at',
                    review_star: '$reviews.star',
                    orderDetail_id: '$order_details._id',
                    reviewer: '$reviews.reviewer'
                }
            }
        ]
        return await this.db.aggregate(pipeline).toArray();
    }
}

const accessoriesRepo = new AccessoriesRepo()

export default accessoriesRepo