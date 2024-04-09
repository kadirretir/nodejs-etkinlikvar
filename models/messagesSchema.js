const mongoose = require("mongoose");
const User = require("./userSchema");
const Event = require("./eventSchema");
const { Schema } = mongoose;

const messagesSchema  = new Schema({
    event: { 
        type: Schema.Types.ObjectId, 
        ref: 'Event',
        required: true 
    }, // Etkinliğin ObjectId'si
    messages: [{
        user: {
             type: Schema.Types.ObjectId,
              ref: 'User', 
              required: true }, // Kullanıcının ObjectId'si, User koleksiyonuna referans verir
        content: { 
            type: String,
             required: true
             }, // Mesaj içeriği
        timestamp: { 
            type: Date,
             default: Date.now 
            } // Mesajın oluşturulma tarihi, varsayılan olarak şu anki zaman
    }]
  });

  const Messages = mongoose.model("Messages", messagesSchema)




module.exports = Messages