const connectToDb = require("../models/db")
const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const passport = require('passport');
const LocalStrategy = require('passport-local');

const verifyCallback = async (email, password, done) => {
    try {
      await connectToDb();
      const user = await User.findOne({ email: email });
        if(user == null) {
            return done(null, false, {message: "Girilen kullanıcıya ait bilgi bulunamadı"})
        }
        if(await bcrypt.compare(password, user.password)) {
          return done(null, user)
        } else {
            return done(null, false, { message: "Girilen Şifre Yanlış" })
        }
    } catch (error) {
      return done(error); // Hata durumunda hata nesnesini done ile geri dönüyoruz
    }
  };
const strategy = new LocalStrategy({usernameField: "email"}, verifyCallback)
passport.use(strategy)

passport.serializeUser(function(user, done) {
    process.nextTick(function() {
    done(null, { id: user.id, username: user.username, email: user.email, membership: user.membershipLevel });
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
        if(!findUser) {

          const  errors = []

          if (!req.body.signupusername) {
            errors.push("Adınızı giriniz");
          }
    
          if (!req.body.signupemail) {
            errors.push("E-Posta adresinizi giriniz");
          }
    
          if (!req.body.signuppassword) {
            errors.push("Parolanızı giriniz");
          }
          if (errors.length > 0) {
            // Hata mesajlarını flaş mesaj olarak ayarlayın
            errors.forEach((error) => req.flash("error", error));
    
            // Kayıt sayfasına yönlendirme yapın
            return res.redirect("/");
          }
    
            const hashedPass = await bcrypt.hash(req.body.signuppassword, 10)
            await User.create({
                username: req.body.signupusername,
                email: req.body.signupemail,
                location: req.body.location,
                password: hashedPass,
            })
            res.redirect("/login")
        } else {
          // Kullanıcı zaten mevcut olduğunda flaş mesaj olarak hata mesajını ayarlayın
          req.flash("error", "Bu e-posta zaten kullanılıyor");
          // Kayıt sayfasına yönlendirme yapın
          return res.redirect("/login");
        }
    } catch (error) {
        throw new Error(error)
    }
  
}

module.exports.login_post = passport.authenticate('local', {
    successRedirect: '/events',
    failureRedirect: '/login',
    failureFlash: true,
    badRequestMessage: "Hatalı Giriş"
  })

  

  module.exports.logout_post = (req,res, next) => {
    req.logout((err) => {
        if(err) return next(err)
        res.redirect('/');
    })
  }
