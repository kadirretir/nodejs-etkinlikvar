const mongoose = require("mongoose")
const { Schema } = mongoose;


const eventsSchema  = new Schema({
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    location: {
      type: String,
      require: true,
    },
    date: {
      type: Date,
      require: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    attendees: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    eventImage: {
      type: String,
      require: true
    }
  
  });

  const Event = mongoose.model("Event", eventsSchema)

module.exports = Event