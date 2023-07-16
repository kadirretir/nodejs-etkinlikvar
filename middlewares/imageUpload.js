const multer  = require('multer')
const path = require("path")


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, Date.now() + path.extname(file.originalname))
    }
  })
  const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 2
    },
    fileFilter: (req,file,cb) => {
      if(
        file.mimetype == "image/png" ||
        file.mimetype == "image/jpg" ||
        file.mimetype == "image/jpeg"
      ) {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error("Sadece PNG, JPG ve JPEG dosya formatları destekleniyor"));
      }
    }
})



module.exports = upload