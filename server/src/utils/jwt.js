import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

// signToken là hàm kí token
export const signToken = ({
  payload, //
  privateKey,
  options = { algorithm: 'HS256' }
}) => {
  return new Promise((resolve, reject) => {
    // kêu jwt kí cho mình
    jwt.sign(payload, privateKey, options, (error, token) => {
      if (error) throw reject(error)
      resolve(token)
    })
  })
}
