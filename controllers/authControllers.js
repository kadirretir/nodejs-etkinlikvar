const connectToDb = require("../models/db")
const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const passport = require('passport');
const LocalStrategy = require('passport-local');
const axios = require("axios");

const verifyCallback = async (email, password, done) => {
    try {
      await connectToDb();
      const user = await User.findOne({ email: email });

        if(user == null) {
            return done(null, false, {message: "Girilen kullanıcıya ait bilgi bulunamadı"})
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
      
        if(isPasswordCorrect) {
          return done(null, user)
        } else {
          return done(null, false, { message: "Girilen kullanıcıya ait bilgi bulunamadı veya bilgiler yanlış" });
      }
    } catch (error) {
      return done(error); // Hata durumunda hata nesnesini done ile geri dönüyoruz
    }
  };
const strategy = new LocalStrategy({usernameField: "email"}, verifyCallback)
passport.use(strategy)

passport.serializeUser(function(user, done) {
    process.nextTick(function() {
    done(null, { id: user.id, username: user.username, email: user.email, membershipLevel: user.membershipLevel, location: user.location, profileImage: user.profileImage });
    });
  });
  
  passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, user);
    });
  });


module.exports.register_post= async (req,res) => {
    try {
        await connectToDb()
        const findUser = await User.findOne({email: req.body.signupemail})
        if(!req.body.signupemail) {
          req.flash("error", "Lütfen gerekli alanları doldurunuz");
          return res.redirect("/login");
        } else if (!findUser) {
          const hashedPass = await bcrypt.hash(req.body.signuppassword, 10)
          await User.create({
              username: req.body.signupusername,
              email: req.body.signupemail,
              location: req.body.location,
              password: hashedPass,
              profileImage: '../uploads/defaultUser.png'
          })
          req.flash("success", "Başarıyla kayıt olundu. Giriş yapabilirsiniz.");
          res.redirect("/login")
        } else {
          // Kullanıcı zaten mevcut olduğunda flaş mesaj olarak hata mesajını ayarlayın
          req.flash("error", "Bu e-posta zaten kullanılıyor");
          // Kayıt sayfasına yönlendirme yapın
          return res.redirect("/login");
        }
    } 
    
    
    catch (error) {
        throw new Error(error)
    }
  
}

module.exports.login_post = async (req, res, next) => {
  // const token = req.body['g-recaptcha-response'][0]
  const token = req.body['g-recaptcha-response']
  const SECRET_KEY_v2 = '6LfSOIMpAAAAALIQhxkrl6k2j_PCHNJkD037EQKK';   
  const recaptchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY_v2}&response=${token}`);
   if(recaptchaResponse.data.success) {
    passport.authenticate('local', {
      successRedirect: '/events',
      failureRedirect: '/login',
      failureFlash: true,
      badRequestMessage: "Lütfen alanları uygun biçimde doldurunuz"
    })(req, res, next);
  } else {
    // reCAPTCHA doğrulaması başarısız olduğunda veya bir hata oluştuğunda bu kısım çalışır
    if (recaptchaResponse.data['error-codes']) {
      console.error('reCAPTCHA error:', recaptchaResponse.data['error-codes']);
    }
    throw new Error("reCAPTCHA doğrulaması başarısız!");
  }

} 

  

  module.exports.logout_post = (req,res, next) => {
    req.logout((err) => {
        if(err) return next(err)
        res.redirect('/');
    })
  }
