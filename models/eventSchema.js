const mongoose = require("mongoose")
const { Schema } = mongoose;


const eventsSchema  = new Schema({
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attendees: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
  
  });

  const Event = mongoose.model("Event", eventsSchema)

module.exports = Event