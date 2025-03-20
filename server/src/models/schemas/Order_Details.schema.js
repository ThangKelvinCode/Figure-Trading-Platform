import { ObjectId  } from "mongodb"

export default class order_details  {
    constructor(detail){
        this._id = detail._id || new ObjectId()
        this.order = detail.order // order ID
        this.quantity = detail.quantity
        this.accessories = detail.accessories // accessories ID
        this.review = detail.review // review ID
        this.price = detail.price
    }
}