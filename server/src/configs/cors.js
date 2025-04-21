import HTTP_STATUS from '../constants/httpStatus.js'

const WHITELIST_DOMAINS = [ 
  'http://localhost:5173',
  'http://localhost:5174',
  //add more domains after deployed
  'http://localhost:3000' // Add this to allow Swagger UI
]

// Cấu hình CORS Option 
export const corsOptions = {
  origin: function (origin, callback) {
    // Cho phép việc gọi API bằng POSTMAN trên môi trường dev,
    // Thông thường khi sử dụng postman thì cái origin sẽ có giá trị là undefined
    if (!origin) {
      return callback(null, true)
    }
    
    // Kiểm tra dem origin có phải là domain được chấp nhận hay không
    if (WHITELIST_DOMAINS.includes(origin)) {
      return callback(null, true)
    }

    // Cuối cùng nếu domain không được chấp nhận thì trả về lỗi
    return callback(new Error(HTTP_STATUS.UNAUTHORIZED, `${origin} not allowed by our CORS Policy.`), false)
  },

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200,

  // CORS sẽ cho phép nhận cookies từ request
  credentials: true
}