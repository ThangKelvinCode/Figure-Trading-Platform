//controllers là tầng xử lí logic và call database thông qua services
import { usersServices } from '../services/users.services.js'
import { ErrorWithStatus } from '../models/Errors.js'
import HTTP_STATUS from '../constants/httpStatus.js'
import { USERS_MESSAGES } from '../constants/messages.js'

//route này nhận vào email và password để tạo tài khoản cho mình
//nhưng trong lúc tạo tài khoản ta dùng insertOne(là 1 promise)
//nên ta sẽ dùng async await để xử lý bất đồng bộ
//và rất có thể trong quá trình get data từ database mình sẽ gặp lỗi, nên phải try catch
const register = async (req, res) => {
  // lấy email và password từ req.body mà người dùng muốn đăng kí tài khoản
  const { email } = req.body

  //kiểm tra email đc gửi lên có tồn tại chưa
  const isDub = await usersServices.checkEmailExist(email)
  if (isDub) {
    throw new ErrorWithStatus({
      status: HTTP_STATUS.UNAUTHORIZED, //401
      message: USERS_MESSAGES.EMAIL_ALREADY_EXISTS
    })
  }

  const result = await usersServices.register(req.body)
  // console.log(result)
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS, //chỉnh lại thông báo
    id: result
  })
}

const login = async (req, res) => {
  //cần lấy email và password để tìm xem user nào đg sở hữu
  //nếu ko có user nào thì ngừng cuộc chơi
  //nếu có thì tạo access và refresh token
  const { email, password } = req.body
  //usersService.login là hàm nhận vào email và password, rồi vào database tìm user và tạo access token và refresh token trả ra ngoài
  const id = await usersServices.login(email, password)
  res.status(HTTP_STATUS.OK).json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    id: id
  })
}

const getUserProfile = async (req, res) => {
  try {
    // console.log(req.params.id)
    const user = await usersServices.getUserProfile(req.params.id)
    // console.log(user)
    return res.status(200).json({
      message: 'success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        date_of_birth: user.date_of_birth
      }
    })
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error', error: err.message })
  }
}

export const userController = {
  register,
  login,
  getUserProfile
}
