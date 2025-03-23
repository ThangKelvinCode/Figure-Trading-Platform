import formidable, { File } from 'formidable'
import fs from 'fs' //thao tác file|folder
import { UPLOAD_IMAGE_TEMP_DIR } from '../constants/dir.js'

//hàm kiểm tra xem có folder uploads ko
//nếu ko thì tạo
export const initFolder = () => {
  //lấy dường dẫn từ gốc hệ thống vào uploads
  //nếu mà đường dẫn ko dẫn tới thư mục thì anh em mình tạo mới luôn
  //   ;[UPLOAD_VIDEO_DIR, UPLOAD_IMAGE_TEMP_DIR].forEach((dir) => {
  if (!fs.existsSync(UPLOAD_IMAGE_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_IMAGE_TEMP_DIR, {
      recursive: true //đệ quy|có thể tạo lồng các thư mục vào nhau
    })
  }
  //   })
}

//handleUploadSingleImage: hàm nhận vào req
// ép req đi qua lưới lọc formidable
// và trả ra các file ảnh thõa đk
// gọi hàm này , bỏ req vào và nhận đc các file ảnh
export const handleUploadImage = async (req) => {
  //chuẩn bị lưới lọc formidable
  const form = formidable({
    uploadDir: UPLOAD_IMAGE_TEMP_DIR,
    maxFiles: 1, //tối đa n file
    maxFileSize: 300 * 1024, // 300kb
    // maxTotalFileSize: 300 * 1024 * 4,
    keepExtensions: true, //giữ lại đuôi của file
    filter: ({ name, originalFilename, mimetype }) => {
      //name là tên của field chứa file <input name = 'fileNe'>
      //originalFilename: tên gốc của file
      //mimetype: kiểu của file 'video/mp4' 'video/mkv' 'image/png' 'image/jpeg'
      const valid = name === 'image' && Boolean(mimetype?.includes('image'))
      if (!valid) {
        form.emit('error', new Error('File Type Invalid!'))
      }
      return valid // chắc chắn true
    }
  })
  //dùng lưới này để lọc file trong req
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      if (!files.image) return reject(new Error('Image is empty'))
      return resolve(files.image[0])
    })
  })
}

//hàm lấy tên của file và bỏ qua extension
// asdas.png => asdas
export const getNameFormFullnameFile = (filename) => {
  //ví dụ filename là anh.nguyen.png => anh-nguyen
  const nameArr = filename.split('.')
  nameArr.pop() //xóa cuối
  return nameArr.join('-')
}
