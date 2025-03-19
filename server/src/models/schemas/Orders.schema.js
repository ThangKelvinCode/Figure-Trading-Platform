import { ObjectId  } from "mongodb"

export default class orders {
    constructor(orders){
        this._id = orders._id || new ObjectId()
        this.date = orders.date || new Date()
        this.status = orders.status || 'pendings'
        this.buyer = orders.buyer
        this.total_price = orders.total_price // = (detail order) quantity * price
        this.payment_method = orders.payment_method || 'pay by cash'
        this.payment_status = orders.payment_status || 'pending'
        this.payment_date = orders.payment_date || new Date()
    }
}