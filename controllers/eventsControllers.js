const connectToDb = require("../models/db")
const Event = require("../models/eventSchema")


module.exports.home_get = async (req,res) => {
    try {
        await connectToDb()
        const events = await Event.find({})
        res.locals.events = events
        res.render("events.ejs")
    } catch (error) {
        throw new Error(error)
    }
}

module.exports.newevent_get= (req,res) => {
    res.render("newevent.ejs")

}

module.exports.newevent_post = async (req,res) => {
    try {
        await connectToDb()
        await Event.create({
            title: req.body.eventPostTitle,
            description: req.body.eventPostDescription,
            location: req.body.eventPostLocation,
            date: req.body.eventPostDate,
            eventImage: req.file.path,
            organizer: res.locals.user.id
        })
        console.log(req.file)
        res.redirect("/events")
    } catch (error) {
        throw new Error(error)
    }
}