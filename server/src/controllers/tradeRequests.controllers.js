import { USER_ROLE } from '../constants/enums.js'
import HTTP_STATUS from '../constants/httpStatus.js'
import { TRADE_REQUESTS_MESSAGES, USERS_MESSAGES } from '../constants/messages.js'
import { ErrorWithStatus } from '../models/Errors.js'
import mediasServices from '../services/medias.sevices.js'
import { tradeRequestServices } from '../services/tradeRequests.services.js'
import { usersServices } from '../services/users.services.js'
import { handleUploadImage } from '../utils/file.js'

//
const getAllRequests = async (req, res) => {
  const result = await tradeRequestServices.getAllRequests()
  res.status(HTTP_STATUS.OK).json({
    message: TRADE_REQUESTS_MESSAGES.GET_TRADE_REQUESTS_SUCCESS,
    result
  })
}

const createRequest = async (req, res) => {
  // kiểm tra userid có tồn tại ko, đúng role ko
  const { user_id } = req.body
  // const user = await usersServices.findUserById(user_id)
  // const isAdmin = user.role == USER_ROLE.Admin // admin thì đúng, dúng thì trả lỗi
  // if (isAdmin) {
  //   throw new ErrorWithStatus({
  //     status: HTTP_STATUS.NOT_FOUND,
  //     message: USERS_MESSAGES.USER_ROLE_IS_NOT_SUITABLE
  //   })
  // }
  // lọc file image, xử lí và trả ra URL để lưu
  // const url = await mediasServices.handleUploadImage(req)
  // insert thông tin mới
  // req.body.image = url
  const result = await tradeRequestServices.createRequest(req.body)
  // trả ra thông tin
  res.status(HTTP_STATUS.OK).json({
    message: TRADE_REQUESTS_MESSAGES.CREATE_REQUEST_SUCCESSFULLY,
    result
  })
}

export const tradeRequestsController = {
  getAllRequests,
  createRequest
}
