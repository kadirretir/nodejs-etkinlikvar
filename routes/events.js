const express = require("express")
const router = express.Router()
const eventsController = require("../controllers/eventsControllers")
const authMiddleware = require("../middlewares/authorization")


router.get("/", eventsController.home_get)
router.get("/newevent", authMiddleware.authForNewEvent, eventsController.newevent_get)
router.post("/newevent",  eventsController.newevent_post)
module.exports = router