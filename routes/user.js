const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/userControllers")
const upload = require("../middlewares/imageUpload")



router.get("/profile", userControllers.profile_get)
router.get("/verify", userControllers.verify_get)
router.post("/verify", userControllers.verify_post)
router.get("/interests", userControllers.interests_get)
router.post("/interests", userControllers.interests_post)
router.post("/changeprofilePicture", upload.single('newUserPhoto'), userControllers.changeProfilePicture_post)

module.exports = router;