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
      enum: ["Sanat ve Kültür", "Spor", "Eğitim ve Gelişim", "Toplum ve Yardım", "İş ve Kariyer", "Teknoloji ve İnovasyon", "Eğlence ve Gezi", "Müzik", "Dans ve Tiyatro", "Film ve Sinema", "Görsel Sanatlar", "Edebiyat ve Yazarlık", "Bilim ve Teknoloji", "Doğa ve Çevre", "Sağlık ve Fitness", "Moda ve Güzellik", "Yiyecek ve İçecek", "Seyahat ve Turizm", "Ev ve Bahçe", "Evcil Hayvanlar", "Oyunlar ve Eğlence", "Konferanslar ve Seminerler", "Çocuk etkinlikleri", "Müzik festivalleri", "Sanat sergileri", "Yardım kampanyaları", "Sosyal sorumluluk projeleri", "Yaz kampı etkinlikleri", "Online etkinlikler"]
    }
  
  });


  const Event = mongoose.model("Event", eventsSchema)

module.exports = Event