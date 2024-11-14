import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({

    destination: function(req, file, cb) {
        const isImage = file.mimetype.startsWith('image/')
        const isVideo = file.mimetype.startsWith('video/')
        if(isImage) {
            cb(null, path.join(__dirname, '../public/images'))
        } else if(isVideo) {
            cb(null, path.join(__dirname, '../public/videos'))
        } else {
            cb(new Error('Unsupported file type'), '')
        }
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname
        console.log(`${file.mimetype} uploaded`)
        cb(null, name)
    }
})
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const isImage = file.mimetype.startsWith('image/')
    const isVideo = file.mimetype.startsWith('video/')
    if(isImage || isVideo) {
         cb(null, true)
    } else {
        console.log('Unsupported file type');
        
    }
}
export const uploadFile = multer({
    storage: storage,
    fileFilter: fileFilter
})