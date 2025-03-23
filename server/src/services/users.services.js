import User from '../models/schemas/User.schema.js'
import { hashPassword } from '../utils/crypto.js'
import { signToken } from '../utils/jwt.js'
import { ErrorWithStatus } from '../models/Errors.js'
import { USERS_MESSAGES } from '../constants/messages.js'
import { ObjectId } from 'mongodb'
import { TokenType, USER_ROLE } from '../constants/enums.js'
import dotenv from 'dotenv'
import HTTP_STATUS from '../constants/httpStatus.js'
import userRepo from '../repositories/users.repo.js'

dotenv.config()

//viết hàm dùng jwt để ký access_token
const signAccessToken = async (user_id) => {
  return signToken({
    payload: { user_id, token_type: TokenType.AccessToken },
    privateKey: process.env.JWT_SECRET_ACCESS_TOKEN,
    options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
  })
}

//viết hàm dùng jwt để ký refresh_token
const signRefreshToken = async (user_id) => {
  return signToken({
    payload: { user_id, token_type: TokenType.RefreshToken },
    privateKey: process.env.JWT_SECRET_REFRESH_TOKEN,
    options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
  })
}

// const signAccessAndRefreshToken = async (user_id) => {
//   return Promise.all([signAccessToken(user_id), signRefreshToken(user_id)])
// }

//viết hàm dùng jwt để kí email_verify_token
const signEmailVerifyToken = async (user_id) => {
  return signToken({
    payload: { user_id, token_type: TokenType.EmailVerificationToken },
    privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN,
    options: { expiresIn: process.env.EMAIL_VERIFY_TOKEN_EXPIRED_IN }
  })
}

const signForgotPasswordToken = async (user_id) => {
  return signToken({
    payload: { user_id, token_type: TokenType.ForgotPasswordToken },
    privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN,
    options: { expiresIn: process.env.EMAIL_FORGOT_PASSWORD_TOKEN_EXPIRED_IN }
  })
}

const checkEmailExist = async (email) => {
  //vào database tìm xem có hông
  // const user = await databaseServices.users.findOne({ email })
  const user = await userRepo.findByEmail(email)
  return Boolean(user) //có true, k false
}

const findUserById = async (user_id) => {
  // const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
  const user = await userRepo.findById(user_id)
  if (!user) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.NOT_FOUND,
      message: USERS_MESSAGES.USER_NOT_FOUND
    })
  }
  //nếu có thì return
  return user
}

const register = async (payload) => {
  // const { email, password } = payload
  // let userId = new ObjectId()
  // const result = await databaseServices.users.insertOne(
  //   new User({
  //     _id: userId,
  //     ...payload,
  //     date_of_birth: new Date(payload.date_of_birth),
  //     //vì User.schema.ts có date_of_birth là Date
  //     //nhưng mà người dùng gửi lên payload là string
  //     password: hashPassword(payload.password)
  //   })
  // )
  const result = await userRepo.createUser(
    new User({
      ...payload,
      password: hashPassword(payload.password),
      date_of_birth: new Date(payload.date_of_birth)
    })
  )

  // const access_token = await this.signAccessToken(user_id)
  // const refresh_token = await this.signRefreshToken(user_id)
  //nên viết là thì sẽ giảm thời gian chờ 2 cái này tạo ra

  // const [access_token, refresh_token] = await Promise.all([
  //   this.signAccessToken(user_id),
  //   this.signRefreshToken(user_id)
  // ]) //đây cũng chính là lý do mình chọn xử lý bất đồng bộ, thay vì chọn xử lý đồng bộ

  // const [access_token, refresh_token] = await signAccessAndRefreshToken(userId)
  //Promise.all giúp nó chạy bất đồng bộ, chạy song song nhau, giảm thời gian

  // return { access_token, refresh_token }
  //ta sẽ return 2 cái này về cho client
  //thay vì return user_id về cho client
  return result
}

const login = async (email, password) => {
  //dùng email và password để tìm user
  // const user = await databaseServices.users.findOne({
  const user = await userRepo.findByEmailAndPassword({
    email,
    password: hashPassword(password)
  })
  if (!user) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT,
      status: HTTP_STATUS.UNPROCESSABLE_ENTITY
    })
  }

  //nếu có user -> tạo ac và rf token
  const user_id = user._id.toString()
  // const [access_token, refresh_token] = await Promise.all([
  //   signAccessToken(user_id), //
  //   signRefreshToken(user_id)
  // ])
  // const [access_token, refresh_token] = await signAccessAndRefreshToken(user_id)

  // return { access_token, refresh_token }
  return user_id
}

const getUserProfile = async (userId) => {
  try {
    // const user = userModel.getUserProfile(userId)
    const user = userRepo.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    } else return user
  } catch (error) {
    throw error
  }
}

export const usersServices = {
  signAccessToken,
  signRefreshToken,
  signEmailVerifyToken,
  signForgotPasswordToken,
  checkEmailExist,
  register,
  login,
  getUserProfile,
  findUserById
}
