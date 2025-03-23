import { ObjectId } from 'mongodb'

export default class category {
    constructor(categories){
        this._id = categories._id || new ObjectId()
        this.type = categories.type
        this.description = categories.description
    }
}

