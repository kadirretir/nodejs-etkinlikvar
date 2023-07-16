const connectToDb = require("../models/db")
const Event = require("../models/eventSchema")
const User = require("../models/userSchema")
const sharp = require('sharp');
const fs = require("fs")
const path = require('path');


module.exports.profile_get = async (req,res) => {
    try {
        await connectToDb()
        const userEvents = await Event.find({organizer: req.user.id})
        const user = await User.findById(req.user.id)
        res.render("user.ejs", {user: user, events: userEvents});
    } catch (error) {
        throw new Error(error)
    }
}

module.exports.changeProfilePicture_post = async (req,res) => {
    try {
        await connectToDb()

        const resizedImageBuffer = await sharp(req.file.path)
        .resize(256, 256, {fit: "cover", background: { r: 255, b: 255, g: 255 } })
        .toBuffer();

        const userFolder = `./uploads/${req.user.id}`;


        const ext = path.extname(req.file.originalname); // Resmin uzantısını al
        const fileName = `profile${ext}`; 

        const profileImagePath = path.join(userFolder, fileName);
        // Kullanıcının klasörünü oluşturma (varsa tekrar oluşturmayacak)
        fs.mkdirSync(userFolder, { recursive: true });

        if (fs.existsSync(profileImagePath)) {
            fs.unlinkSync(profileImagePath);
          }

        fs.writeFile(profileImagePath, resizedImageBuffer, (err) => {
          if (err) {
            console.error('Dosya kaydedilemedi:', err);
            return;
          }
          fs.unlinkSync(req.file.path);
        });
       
        const user = await User.findById(req.user.id);
        user.profileImage = `../${profileImagePath}`;
        await user.save();
    
        res.redirect("/user/profile")
    } catch (error) {
        throw new Error(error)
    }
}