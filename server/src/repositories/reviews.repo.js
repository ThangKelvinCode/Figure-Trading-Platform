import { ObjectId } from "mongodb"
import database from "../configs/database.js"
import dotenv from 'dotenv'

dotenv.config()

class Review {
    constructor(){
        this.db = database.db.collection(process.env.DB_REVIEW_COLLECTION)
    }

    async writeReview(review) {
        return await this.db.insertOne(review)
    }
    
    async getReview(id) {
        return await this.db.findOne({ _id: new ObjectId(id)})
    }
    
    async editReview(newRate, newContent, id) {
        return await this.db.updateOne(
            { _id: id }, 
            { $set: { content: newContent, star: newRate } }
        )
    }

    async deleteReview(id) {
        return await this.db.deleteOne({ _id: new ObjectId(id)})
    }
}

const reviewRepo = new Review()

export default reviewRepo