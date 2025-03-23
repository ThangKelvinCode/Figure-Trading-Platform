import { ObjectId } from "mongodb"

export default class reviews {
    constructor(review){
        this._id = review._id || new ObjectId()
        this.reviewer = review.reviewer // user ID
        this.order_detail = review.order_detail // order detail ID
        this.content = review.content
        this.create_at = review.create_at || new Date()
        this.star = review.star || 5 // from 1 to 5
    }
}