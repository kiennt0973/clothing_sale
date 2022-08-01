const multer  = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = file.originalname.split('.')[0] + '-' + Date.now() + '.' + file.originalname.split('.')[1]
        cb(null, uniqueSuffix)
    }
})

function fileFilter (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        // return callback(new Error('Only images are allowed'))
        return callback(null,false)
    }
    callback(null, true)
}

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

module.exports = upload