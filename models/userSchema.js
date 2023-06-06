const mongoose = require("mongoose")
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    location: {
        type: String,
        require: false
    },
    membershipLevel: {
        type: String,
        enum: ['free', 'premium'],
        default: "free",
    },
    profileImage: {
        type: String,
        contentType: String
      }
})

const User = mongoose.model('User', userSchema);

module.exports = User;