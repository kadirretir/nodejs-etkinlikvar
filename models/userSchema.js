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
        require: true
      }
})


// User modelindeki membershipLevel alanının güncellendiğinde çalışacak işlevi tanımlayın


const User = mongoose.model('User', userSchema);

// KULLANICI MEMBERSHIP ALANINI FREE YA DA PREMIUM'A ÇEVİRME KODU
// async function updateUserMembershipLevel(username, newMembershipLevel) {
//     try {
//         // Kullanıcıyı kullanıcı adına göre bulun
//         const user = await User.findOne({ username: "murat" });
        
//         if (!user) {
//             console.log('Kullanıcı bulunamadı.');
//             return;
//         }

//         // Kullanıcı belgesini güncelle
//         user.membershipLevel = newMembershipLevel;
//         await user.save();

//         console.log(`Kullanıcı "${username}" için membershipLevel alanı başarıyla güncellendi.`);
//     } catch (error) {
//         console.error('Kullanıcı güncellenirken bir hata oluştu:', error);
//     }
// }

// updateUserMembershipLevel('exampleUser', 'premium');

module.exports = User;