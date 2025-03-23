// file này chứa hàm có tên là wrapAsync
//wrapAsync là 1 hàm nhận vào 'async request handler'
// và nó tạo ra cấu trúc try catch next cho 'async request handler'
// từ đó 'async request handler' có thẻ throw thoải mái mà ko cấn try catch next
export const wrapAsync = (func) => {
  return async (req, res, next) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
