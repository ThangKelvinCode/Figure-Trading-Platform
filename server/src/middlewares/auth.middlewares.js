import jwt from 'jsonwebtoken';
import { ErrorWithStatus } from '../models/Errors.js';
import HTTP_STATUS from '../constants/httpStatus.js';
import { USERS_MESSAGES } from '../constants/messages.js';
import dotenv from 'dotenv';
import { usersServices } from '../services/users.services.js';
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
      status: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET_ACCESS_TOKEN, (err, decoded) => {
    if (err) {
      throw new ErrorWithStatus({
        message: 'Invalid token',
        status: HTTP_STATUS.UNAUTHORIZED,
      });
    }

    req.user = decoded; // Lưu thông tin user vào req (user_id, token_type)
    next();
  });
};

export const restrictTo = (...roles) => {
    return async (req, res, next) => {
      const user = await usersServices.findUserById(req.user.user_id);
      if (!roles.includes(user.role)) {
        throw new ErrorWithStatus({
          message: USERS_MESSAGES.USER_ROLE_IS_NOT_SUITABLE,
          status: HTTP_STATUS.FORBIDDEN,
        });
      }
      req.fullUser = user;
      next();
    };
  };