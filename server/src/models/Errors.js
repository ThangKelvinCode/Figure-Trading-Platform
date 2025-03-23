//ở đây thường mình sẽ extend Error để nhận đc báo lỗi ở dòng nào

import HTTP_STATUS from '../constants/httpStatus.js'
import { USERS_MESSAGES } from '../constants/messages.js'

export class ErrorWithStatus {
  constructor({ message, status }) {
    this.message = message
    this.status = status
  }
}

export class EntityError extends ErrorWithStatus {
  //từ có status và message
  constructor({ message = USERS_MESSAGES.VALIDATION_ERROR, errors }) {
    super({ message, status: HTTP_STATUS.UNPROCESSABLE_ENTITY })
    this.errors = errors
  }
}