const express = require("express")
const router = express.Router()
const eventsController = require("../controllers/eventsControllers")
const authMiddleware = require("../middlewares/authorization")
const upload = require("../middlewares/imageUpload")

router.get("/newevent", authMiddleware.authForNewEvent, eventsController.newevent_get);
router.post("/newevent", upload.single('eventPhoto'), eventsController.newevent_post);
router.get("/requestedevents", eventsController.requested_events_get);
router.get("/requestedevents/:title", eventsController.getEventByTitle);
router.get("/:id", eventsController.singular_event_get);
router.post("/:id/join", eventsController.add_attendees_post);
router.post("/:id/remove", eventsController.remove_attendee_post);
router.get("/", eventsController.home_get);
router.post("/", eventsController.home_post);
module.exports = router