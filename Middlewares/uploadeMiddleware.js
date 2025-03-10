const cloudinary = require("../config/cloudinary")
const multer = require("multer")
const {CloudinaryStorage} =require("multer-storage-cloudinary")

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"skillBridge",
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],

    }
})
const upload = multer( {storage:storage})
module.exports = upload