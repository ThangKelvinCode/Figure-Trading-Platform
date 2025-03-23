export class UserVerifyStatus {
  static _Unverified = 0 // chưa xác thực email, mặc định = 0
  static _Verified = 1 // đã xác thực email
  static _Banned = 2 // bị khóa

  static get Unverified() {
    return this._Unverified
  }
  static get Verified() {
    return this._Verified
  }
  static get Banned() {
    return this._Banned
  }
}
export class USER_ROLE {
  static _Admin = 0 //0
  static _User = 1 //2

  static get Admin() {
    return this._Admin
  }
  static get User() {
    return this._User
  }
}

export class TokenType {
  static _AccessToken = 0
  static _RefreshToken = 1
  static _ForgotPasswordToken = 2
  static _EmailVerificationToken = 3

  static get AccessToken() {
    return this._AccessToken
  }
  static get RefreshToken() {
    return this._RefreshToken
  }
  static get ForgotPasswordToken() {
    return this._ForgotPasswordToken
  }
  static get EmailVerificationToken() {
    return this._EmailVerificationToken
  }
}

export class TradeRequestStatus {
  static _Ended = 0
  static _Pending = 1

  static get Ended() {
    return this._Ended
  }
  static get Pending() {
    return this._Pending
  }
}

export class MediaType {
  static _Image = 0
  static _Video = 1

  static get Image() {
    return this._Image
  }
  static get Video() {
    return this._Video
  }
}
