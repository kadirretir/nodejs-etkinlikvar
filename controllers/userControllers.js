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
        const successMessages = req.flash('success');
        res.render("user.ejs", {user: user, events: userEvents, successMessages: successMessages});
    } catch (error) {
        throw new Error(error)
    }
}

module.exports.verify_post = async (req,res, next) => {
  try {
    await connectToDb();
    const emailToken = req.body.emailToken;

    if (!emailToken) {
        return res.status(400).json({ error: "E-Mail onaylamada bir sorun oluştu. Lütfen yetkililere danışınız." });
    }

    const user = await User.findOne({ _id: req.user.id, emailToken: req.body.emailToken });
    if (user) {
        user.emailToken = null;
        user.isVerified = true;
        await user.save();

        const updatedUser = {
          ...req.user,
          emailToken: user.emailToken,
          isVerified: user.isVerified
      };

        req.logIn(updatedUser, function(err) {
          if (err) {
            res.json({error: "404"})
            console.log(err, "  HATA")
          } else {
            console.log("HATA YOK")
          }
        });
        req.session.passport.user = updatedUser;
        req.session.save(function(err) {
  if (err) {
    // Hata işleme
  } else {
    // Oturum verisi başarıyla güncellendi
  }
}); 
        return res.json({ message: "DOĞRULAMA ONAYLANDI" });
    } else {
        // Kullanıcı bulunamadığında hata mesajını döndür
        return res.json({ error: "Girilen Kod Geçersiz" });
    }
} catch (error) {
    // Sunucu hatası durumunda hata mesajını döndür
    return res.status(500).json({ error: "Sunucu hatası: " + error.message });
}
}


module.exports.verify_get = async (req,res) => {
  try {
    await connectToDb();
    const findToken = await User.findById(req.user.id).select("emailToken")
    res.render("verify.ejs", { messages: req.flash(), userToken: findToken})
  } catch (error) {
    throw new Error(error)
  }
}


module.exports.interests_get = async (req,res) => {
  try {
    await connectToDb();
    
    const eventSchema = Event.schema;

      // Get Categories
    const eventCategories = eventSchema.path('eventCategory').enumValues;

    // Get SubCategories
    const subCategories = eventSchema.path('eventSubCategory').defaultValue();

    res.render("interests.ejs", {eventCategories:eventCategories, subCategories: subCategories} )
  } catch (error) {
    throw new Error(error)
  }

}

module.exports.interests_post = async (req,res) => {
    try {
      await connectToDb();
      const findUser = await User.findById(req.user.id);

      findUser.interests = req.body.selectedContents;
      await findUser.save()
      return res.redirect("/user/profile")
    } catch (error) {
      throw new Error(error)
    }
}

module.exports.profile_edit_post = async (req,res) => {
    try {
        await connectToDb()
        const user = await User.findById(req.user.id);
        if (req.body.username) {
          user.username = req.body.username;
        }
    
        if (req.body.biografy) {
          user.biografy = req.body.biografy;
        }

        if (req.file && req.file.path) { 
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

          user.profileImage = `../${profileImagePath}`;
        }
 
        await user.save();
        res.redirect("/user/profile")
    } catch (error) {
        throw new Error(error)
    }
}

module.exports.main_get = async (req,res) => {
  try {
    await connectToDb()
    const userEvents = await Event.find({organizer: req.user.id})
    const user = await User.findById(req.user.id)
    const successMessages = req.flash('success');
    res.render("user.ejs", {user: user, events: userEvents, successMessages: successMessages});
} catch (error) {
    throw new Error(error)
}
}

