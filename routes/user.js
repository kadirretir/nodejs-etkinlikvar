const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/userControllers")
const upload = require("../middlewares/imageUpload")



router.get("/profile", userControllers.profile_get)
router.post("/changeprofilePicture", upload.single('newUserPhoto'), userControllers.changeProfilePicture_post)

module.exports = router;