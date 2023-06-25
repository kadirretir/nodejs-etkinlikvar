const express = require("express")
const router = express.Router()
const userControllers = require("../controllers/userControllers")

router.get("/profile", userControllers.profile_get)

module.exports = router;