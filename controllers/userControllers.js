const connectToDb = require("../models/db")
const Event = require("../models/eventSchema")
const User = require("../models/userSchema")
const sharp = require('sharp');
const fs = require("fs")
const path = require('path');
const eventSubCategories = require("../models/eventSubCategories")

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


module.exports.registrationverify_get = async (req,res) => {
  try {
    await connectToDb();
    const findToken = await User.findById(req.user.id).select("emailToken")
    res.render("registrationverify.ejs", { messages: req.flash(), userToken: findToken})
  } catch (error) {
    throw new Error(error)
  }
}


module.exports.interests_post = async (req,res) => {
  try {
    await connectToDb();
    const findUser = await User.findById(req.user.id);
    findUser.interests = req.body.selectedContents;
    await findUser.save();

    // İstek gönderen URL'yi Referer header'ından al
    const refererUrl = req.get('Referer');
    // Eğer Referer URL /user/interest ise JSON yanıtı döndür
    if (refererUrl && refererUrl.endsWith('/user/interest')) {
      return res.json({ message: "Değişiklikleriniz başarıyla kayıt edildi." });
    } else {
      // Değilse kullanıcıyı /user/interest sayfasına yönlendir
      return res.redirect("/user/interest");
    }
  } catch (error) {
    res.status(500).send('Sunucu hatası.');
  }
}

module.exports.interests_get = async (req,res) => {
  try {
    await connectToDb();
    const newInterests = await User.findById(req.user.id).select("interests");
    res.json(newInterests)

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

        if (req.body.locationedit) {
          user.location = req.body.locationedit
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
        req.flash("success", "Ayarlarınız başarıyla kayıt edildi.")
        await user.save();
        res.redirect("/user/profile")
    } catch (error) {
        throw new Error(error)
    }
}


module.exports.personal_info_post = async (req,res) => {
  try {
    await connectToDb();
    const { day, month, year, gender, twitter } = req.body;
  
    // Kullanıcıyı ID'sine göre bul
    const findUser = await User.findById(req.user.id);
    
    // Gelen tarih bilgilerini Date objesi olarak oluştur
    const newBirthDate = new Date(year, month - 1, day);
    // Veritabanındaki tarih ile yeni gelen tarih bilgisini karşılaştır
    if (!findUser.birthDate || findUser.birthDate.getTime() !== newBirthDate.getTime()) {
      // Farklıysa, yeni tarih bilgisini veritabanına kaydet
      findUser.birthDate = newBirthDate;
      await findUser.save();
    }
  
    if(findUser.gender !== gender) {
      findUser.gender = gender;
      await findUser.save();
    }

    if(findUser.twitterLink !== twitter) {
      findUser.twitterLink = twitter;
      await findUser.save();
    }
    
    // Bilgileri güncelleme başarılıysa, kullanıcıyı bilgilendir
    req.flash("success", "Bilgileriniz başarıyla kaydedildi");
    res.redirect("/user/information");
  } catch (error) {
    // Hata oluşursa, kullanıcıyı bilgilendir
    req.flash("error", "Bir hata oluştu: " + error.message);
    res.redirect("/user/information");
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

