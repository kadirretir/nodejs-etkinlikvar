const mongoose = require("mongoose");
const User = require("./userSchema");
const eventSubCategories = require("./eventSubCategories");
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
    cityName: {
      type: String,
      required: true,
    },
    districtName: {
      type: String,
      required: true
    },
    fullAddress: {
      type: String,
      required: true
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
    attendees: [
       { 
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    eventImage: {
      type: String,
      required: true
    },
    eventCategory: {
      type: String,
      required: true,
      enum: Object.keys(eventSubCategories)
    },
    eventSubCategory: {
      type: String,
      required: true,
      validate: {
        validator: function(subCategory) {
          const categories = eventSubCategories[this.eventCategory];
          return categories && categories.includes(subCategory);
        },
        message: props => `${props.value} seçilmiş kategori için uygun alt ilgi alanı değil`
      }
    },
   participantLimit: {
      type: Number,
      default: null, 
   },
    status: {
      type: String,
      required: true,
      enum: ["active", "cancelled", "completed"],
      default: "active"
  }
  
  });

  

  const Event = mongoose.model("Event", eventsSchema)


  //  Event.collection.dropIndexes();


  Event.schema.index({
    title: 'text',
    eventCategory: 'text',
    eventSubCategory: 'text',
    description: 'text',
    cityName: 'text',
    districtName: 'text'
  }, { default_language: "turkish" });

module.exports = Event