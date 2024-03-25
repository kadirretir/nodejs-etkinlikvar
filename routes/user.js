const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/userControllers")
const upload = require("../middlewares/imageUpload")
const {checkVerificationComplete} = require("../middlewares/authorization")

const paths = ["/profile", "/information", "/privacy", "/paymentmethod", "/subscription", "/interest"];

paths.forEach((path) => {
  router.get(path, userControllers.main_get);
});
router.get("/registrationinterests",  userControllers.registrationverify_get)
router.get("/registrationverify",  userControllers.registrationverify_get)

router.post("/verify",  userControllers.verify_post)
router.post("/interests", userControllers.interests_post)

router.get("/interests", userControllers.interests_get)

router.post("/personalinfo", userControllers.personal_info_post)
router.post("/editprofile", upload.single('newUserPhoto'), userControllers.profile_edit_post)


module.exports = router;