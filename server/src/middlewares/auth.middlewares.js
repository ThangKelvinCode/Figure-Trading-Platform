import jwt from 'jsonwebtoken';
import { ErrorWithStatus } from '../models/Errors.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import { USERS_MESSAGES } from '../constants/messages.js';
import dotenv from 'dotenv';
import { usersServices } from '../services/users.services.js';
dotenv.config();

//chỉnh thành try-catch
//ko chơi throw
export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
      });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message: 'Invalid token',
        });
      }

      req.user = decoded; // Lưu thông tin user vào req (user_id, token_type)
      next();
    });
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      message: USERS_MESSAGES.SERVER_ERROR,
    });
  }
};


//thêm try-catch vô middleware
// ko chơi throw
//throw new ErrorWithStatus
export const restrictTo = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await usersServices.findUserById(req.user.user_id);
      if (!user) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: USERS_MESSAGES.USER_NOT_FOUND,
        });
      }

      if (!roles.includes(user.role)) {
        return res.status(HTTP_STATUS.FORBIDDEN).json({
          message: USERS_MESSAGES.USER_ROLE_IS_NOT_SUITABLE,
        });
      }

      req.fullUser = user;
      next();
    } catch (error) {
      return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        message: USERS_MESSAGES.SERVER_ERROR,
      });
    }
  };
};