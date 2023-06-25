const connectToDb = require("../models/db")
const Event = require("../models/eventSchema")

module.exports.profile_get = async (req,res) => {
    try {
        await connectToDb()
        const userEvents = await Event.find({organizer: req.user.id})
        res.render("user.ejs", {user: req.user, events: userEvents});
    } catch (error) {
        throw new Error(error)
    }
}