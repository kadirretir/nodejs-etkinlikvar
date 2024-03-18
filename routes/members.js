const express = require("express")
const router = express.Router()
const membersControllers = require("../controllers/membersControllers")


router.get("/:id", membersControllers.individual_member_get);

module.exports = router;