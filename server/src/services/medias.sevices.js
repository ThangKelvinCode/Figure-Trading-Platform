import sharp from 'sharp'
import fs from 'fs'
import { getNameFormFullnameFile, handleUploadImage } from '../utils/file.js'
import { UPLOAD_IMAGE_DIR } from '../constants/dir.js'
import { MediaType } from '../constants/enums.js'

class MediaServices {
  async handleUploadImage(req) {
    const file = await handleUploadImage(req) //lấy file trong req

    // const result = await Promise.all(    //phần này sẽ đc sài khi có nhiều ảnh trong request
    //   files.map(async (file) => {
    const newFileName = getNameFormFullnameFile(file.newFilename) + '.jpg' //lấy tên cũ bỏ đuôi sau, thêm đuôi .jpg
    const newPath = UPLOAD_IMAGE_DIR + '/' + newFileName //đường dẫn mới để lưu ảnh
    //nén
    const infor = await sharp(file.filepath).jpeg().toFile(newPath)
    //xóa file ảnh cũ
    fs.unlinkSync(file.filepath)
    //trả ra đường đẫn để lưu vào db
    return newPath
    //   }) // này nữa
    // )
    return result
  }

  //   async handleUploadVideo(req: Request) {
  //     const files = await handleUploadVideo(req) //lấy file trong req

  //     const result = await Promise.all(
  //       files.map(async (file) => {
  //         const url: Media = {
  //           url: `http://localhost:3000/static/image/${file.newFilename}`, //
  //           type: MediaType.Video
  //         }
  //         return url
  //       })
  //     )
  //     return result
  //   }
}

const mediasServices = new MediaServices()
export default mediasServices
