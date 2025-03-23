export const USERS_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  //name
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  //email
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  //password
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50: 'Password length must be from 8 to 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  //confirmPassword
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50: 'Confirm length must be from 8 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  //dateOfBirth
  DATE_OF_BIRTH_BE_ISO8601: 'Date of birth must be ISO8601',
  //user
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  LOGIN_SUCCESS: 'Login Successfully',
  REGISTER_SUCCESS: 'Register Successfully',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  LOGOUT_SUCCESS: 'Logout successfully',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_VERIFY_TOKEN_IS_INVALID: 'Email verify token is invalid',
  EMAIL_VERIFY_SUCCESS: 'Email verify Successfully',
  EMAIL_HAS_BEEN_VERIFIED: 'Email has been verified',
  ACCOUNT_HAS_BEEN_BANNED: 'Account has been banned',
  RESEND_EMAIL_SUCCESS: 'Resend email verify successfully',
  USER_NOT_FOUND: 'User not found',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check Email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',
  FORGOT_PASSWORD_TOKEN_NOT_MATCH: 'Forgot password token not match',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Verify forgot password token success',
  RESET_PASSWORD_SUCCESS: 'Reset password successfully',
  GET_PROFILE_SUCCESS: 'Get profile successfully',
  USER_ROLE_IS_NOT_SUITABLE: 'User role is not suitable for this action',

  BIO_MUST_BE_A_STRING: 'Bio must be a string',
  BIO_LENGTH_MUST_BE_LESS_THAN_200: 'Bio length must be less than 200',
  LOCATION_MUST_BE_A_STRING: 'Location must be a string',
  LOCATION_LENGTH_MUST_BE_LESS_THAN_200: 'Location length must be less than 200',
  WEBSITE_MUST_BE_A_STRING: 'Website must be a string',
  WEBSITE_LENGTH_MUST_BE_LESS_THAN_200: 'Website length must be less than 200',
  USERNAME_MUST_BE_A_STRING: 'Username must be a string',
  USERNAME_LENGTH_MUST_BE_LESS_THAN_50: 'Username length must be less than 50',
  IMAGE_URL_MUST_BE_A_STRING: 'Image url must be a string',
  IMAGE_URL_LENGTH_MUST_BE_LESS_THAN_400: 'Image url length must be less than 400',
  UPDATE_PROFILE_SUCCESS: 'Update profile success',
  USER_NOT_VERIFIED: 'User not verified',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  USERNAME_IS_INVALID:
    'Username must be a string and length must be 4 - 15, and contain only letters, numbers, and underscores, not only numbers',
  CHANGE_PASSWORD_SUCCESS: 'Change password successfully',
  REFRESH_TOKEN_SUCCESS: 'Refresh token change Successfully',
  //Product and others
  EMPTY_DESCRIPTION : 'Please fill in description',
  EMPTY_PRICE: 'Please fill in price',
  EMPTY_PHOTO: 'Please upload product photos'
}

export const TRADE_REQUESTS_MESSAGES = {
  GET_TRADE_REQUESTS_SUCCESS: 'Get trade request success',
  ITEM_MUST_HAVE_NAME: 'Item must have name',
  CREATE_REQUEST_SUCCESSFULLY: 'Create request successfully'
}

//Blindbox message
export const BLINDBOX_MESSAGES = {
  // General messages
  VALIDATION_ERROR: 'Validation error',
  BLINDBOX_NOT_FOUND: 'Blind box not found',
  UNAUTHORIZED_ACCESS: 'Unauthorized access to blind box',

  // Creation related messages
  CREATE_BLINDBOX_SUCCESS: 'Blind box created successfully',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  IMAGE_IS_REQUIRED: 'Image is required',
  IMAGE_MUST_BE_A_VALID_URL: 'Image must be a valid URL',
  DESCRIPTION_IS_REQUIRED: 'Description is required',
  DESCRIPTION_MUST_BE_A_STRING: 'Description must be a string',

  // Update related messages
  UPDATE_BLINDBOX_SUCCESS: 'Blind box updated successfully',

  // Delete related messages
  DELETE_BLINDBOX_SUCCESS: 'Blind box deleted successfully',

  // Other messages
  OWNER_NOT_FOUND: 'Owner of the blind box not found'
  // Add more messages as needed for other blind box operations
}

export const OFFER_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  OFFER_ITEM_REQUIRED: 'Offer item is required',
  OFFER_ITEM_MUST_BE_STRING: 'Offer item must be a string',
  OFFER_DESCRIPTION_REQUIRED: 'Offer description is required',
  OFFER_DESCRIPTION_MUST_BE_STRING: 'Offer description must be a string',
  OFFER_IMAGE_REQUIRED: 'Offer image is required',
  OFFER_IMAGE_MUST_BE_STRING: 'Offer image must be a string',
  OFFER_IMAGE_INVALID_URL: 'Offer image must be a valid URL',
  REQUESTER_ID_REQUIRED: 'Requester ID is required',
  REQUESTER_ID_INVALID: 'Requester ID is invalid',
  REQUEST_ID_REQUIRED: 'Request ID is required',
  REQUEST_ID_INVALID: 'Request ID is invalid',
  OFFER_STATUS_REQUIRED: 'Offer status is required',
  OFFER_STATUS_INVALID: 'Offer status is invalid',
  CREATE_OFFER_SUCCESS: 'Offer created successfully',
  OFFER_NOT_FOUND: 'Offer not found',
  UPDATE_OFFER_SUCCESS: 'Offer updated successfully',
  DELETE_OFFER_SUCCESS: 'Offer deleted successfully'
}
