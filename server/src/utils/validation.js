import express from 'express'
import { validationResult } from 'express-validator'
import HTTP_STATUS from '../constants/httpStatus.js'
import { EntityError, ErrorWithStatus } from '../models/Errors.js'

export const validate = (validation) => {
  return async (req, res, next) => {
    await validation.run(req) //hàm tìm lỗi của middleware schema và đưa vào req

    const errors = validationResult(req) //funct này giúp ta lấy lỗi ra từ biến req
    if (errors.isEmpty()) {
      return next()
    }

    const errorObject = errors.mapped() //hàm này giúp ta lấy lỗi ra dưới dạng object
    const entityError = new EntityError({ errors: {} })
    //duyệt từng lỗi
    for (const key in errorObject) {
      const { msg } = errorObject[key] //phân rã msg của mỗi lỗi
      //nếu msg nào có dạng như ErrorWithStatus và có status khác 422 thì ném lỗi cho default error handler xử lý
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      //những lỗi là 422 sẽ đc nhét vào entity Error
      entityError.errors[key] = errorObject[key].msg
    }
    next(entityError)
  }
}
