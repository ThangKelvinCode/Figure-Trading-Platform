import pkg from 'lodash'
const { omit } = pkg
import HTTP_STATUS from '../constants/httpStatus.js'
import { ErrorWithStatus } from '../models/Errors.js'
//file này chứa hàm error handler tổng
// các lỗi toàn từ hệ thống sẽ đc dồn về đây
export const defaultErrorHandler = (err, req, res, next) => {
  //err là lỗi từ các nơi khác truyền xuống,
  //và ta đã quy ước lỗi phải là 1 object có 2 thuộc tính: status và message
  if (err instanceof ErrorWithStatus) {
    res.status(err.status).json(omit(err, '[status]'))
  } else {
    //lỗi khác ErrorWithStatus, nghĩa là lỗi bth, lỗi ko có status,
    //lỗi có tùm lum thứ stack, name, ko có status
    Object.getOwnPropertyNames(err).forEach((key) => {
      Object.defineProperty(err, key, {
        enumerable: true
      })
    })

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: err.message,
      errorInfor: omit(err, ['stack'])
    })
  }
}