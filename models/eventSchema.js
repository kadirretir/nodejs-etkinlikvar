const mongoose = require("mongoose");
const User = require("./userSchema");
const eventSubCategories = require("./eventSubCategories");
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
    cityName: {
      type: String,
      require: true,
    },
    districtName: {
      type: String,
      require: true
    },
    fullAddress: {
      type: String,
      require: true
    },
    date: {
      type: Date,
      require: true,
    },
    premium: {
      type: Boolean,
      require: true,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    attendees: [
       { 
        type: Schema.Types.ObjectId,
        ref: "User",
      }
    ],
    eventImage: {
      type: String,
      require: true
    },
    eventCategory: {
      type: String,
      require: true,
      enum: ["Sanat ve Kültür", "Spor", "Eğitim ve Gelişim", "Toplum ve Yardım", "İş ve Kariyer", "Teknoloji ve İnovasyon", "Eğlence ve Gezi", "Müzik", "Dans ve Tiyatro", "Film ve Sinema", "Görsel Sanatlar", "Edebiyat ve Yazarlık", "Bilim ve Teknoloji", "Doğa ve Çevre", "Sağlık ve Fitness", "Moda ve Güzellik", "Yiyecek ve İçecek", "Seyahat ve Turizm", "Ev ve Bahçe", "Evcil Hayvanlar", "Oyunlar ve Eğlence", "Konferanslar ve Seminerler", "Müzik festivalleri", "Sanat sergileri", "Yardım kampanyaları", "Sosyal sorumluluk projeleri", "Yaz kampı etkinlikleri", "Online etkinlikler"]
    },
    eventSubCategory: {
      type: [[String]],
      default: eventSubCategories,
  },
   participantLimit: {
      type: Number,
      default: null, // Varsayılan olarak sınırsız
   },
    status: {
      type: String,
      required: true,
      enum: ["active", "cancelled", "completed"],
      default: "active"
  }
  
  });

  eventsSchema.pre('save', async function(next) {
    try {
        const organizer = await User.findById(this.organizer);
        if (organizer) {
            this.premium = organizer.membershipLevel === 'premium'; // Etkinliğin premium alanını organizatörün membershipLevel'ına göre ayarlayın
        }
        next();
    } catch (error) {
        next(error);
    }
});



  const Event = mongoose.model("Event", eventsSchema)

module.exports = Event