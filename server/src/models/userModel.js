import { ObjectId } from 'mongodb'
import userRepo from '../repositories/users.repo.js'

const getUserProfile = async (userId) => {
  try {
    return userRepo.findById({ _id: new ObjectId(userId) })
  } catch (error) {
    throw new Error(error)
  }
}
export const userModel = {
  getUserProfile
}
