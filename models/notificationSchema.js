const mongoose = require("mongoose")
const {Schema} = mongoose;

const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    message: String,
    isNotificationSeen: Boolean
  });
  
  // Bildirim modeli
  const Notification = mongoose.model('Notification', NotificationSchema);

  module.exports = Notification;