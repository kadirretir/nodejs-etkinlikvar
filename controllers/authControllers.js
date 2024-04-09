const connectToDb = require("../models/db")
const User = require("../models/userSchema")
const bcrypt = require("bcrypt")
const passport = require('passport');
const LocalStrategy = require('passport-local');
const axios = require("axios");
const crypto = require("crypto");
const nodemailer = require('nodemailer');
require('dotenv').config();


function generateVerificationCode() {
  // Rasgele 3 byte (24 bit) veri oluştur
  const randomBytes = crypto.randomBytes(3);
  // Oluşturulan veriyi hexadecimal formata dönüştür
  const verificationCode = randomBytes.toString('hex');
  // Sonuç olarak 6 haneli bir onay kodu oluşturulur
  return verificationCode.slice(0, 6);
}


const verifyCallback = async (email, password, done) => {
    try {
      await connectToDb();
      const user = await User.findOne({ email: email });

      if(!email || !password) {
        return done(null, false, {message: "Lütfen gerekli alanları doldurunuz"})
      }

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
    done(null, { id: user.id, username: user.username, email: user.email, membershipLevel: user.membershipLevel, location: user.location, profileImage: user.profileImage, emailToken: user.emailToken });
    });
  });
  
  passport.deserializeUser(function(user, done) {
    process.nextTick(function() {
      return done(null, user);
    });
  });


module.exports.register_post= async (req,res, next) => {
    try {
        await connectToDb()
        const findUser = await User.findOne({email: req.body.signupemail})
        const isUserNameTaken = await User.findOne({username: req.body.signupusername})
      
        if(!req.body.signupemail) {
          req.flash("error", "Lütfen gerekli alanları doldurunuz");
          return res.redirect("/login");
        } else if (!req.body.ageVerification) {
            req.flash("error", "Kayıt olabilmek için 18 yaşından büyük olmanız gerekmektedir")
        } else if (isUserNameTaken) {
          req.flash("error", "Bu kullanıcı adı alınmış.");
          // Kayıt sayfasına yönlendirme yapın
          return res.redirect("/login");
        } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/.test(req.body.signuppassword)) {
          req.flash("error", "Şifre en az bir harf ve bir rakam içermeli, ve en az 6 karakter uzunluğunda olmalı");
          return res.redirect("/login");
        } else if (!findUser) {
          const hashedPass = await bcrypt.hash(req.body.signuppassword, 10)
         const newUser = await User.create({
              username: req.body.signupusername,
              email: req.body.signupemail,
              location: req.body.location,
              password: hashedPass,
              profileImage: '../uploads/defaultUser.png',
              emailToken: generateVerificationCode()
          })

          const userName = newUser.username.charAt(0).toUpperCase() + newUser.username.slice(1);

          async function main() {
            const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email</title>
                <!-- Bootstrap CSS -->
                <link href="https://stackpath.bootstrapcdn.com/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    .container {
                      display: flex;
                      width: 100%;
                      margin: 0 auto;
                      align-content: center;
                      flex-direction: column;
                      flex-wrap: wrap;
                    }
                    .email-content {
                        text-align: center;
                        background-color: #fff;
                        padding: 30px;
                        width: 100%;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
                    }
                    .email-title {
                        color: black;
                    }

                    .email-title span {
                      color: #FD3412;
                    }
                    .badgeLogo {
                      background: linear-gradient(rgba(253, 52, 18, 1), rgba(253, 52, 18, 0.8));
                      border-radius: 5rem;
                      cursor: pointer;
                      pointer-events: none;
                      width: 30%;
                      line-height: 0.5rem;
                      margin: 0 auto;
                      padding: 0.6rem 0;
                   }
                   
                   .badgeLogo h2 {
                       color: white;
                       font-size: 1.4rem;
                       text-align: center;
                       font-family: var(--first-font);
                   }
                    .verification-code {
                        font-size: 24px;
                        font-weight: bold;
                        color: dark;
                        margin-top: 20px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                            <div class="email-content">
                                  <div class="badgeLogo">
                                  <h2>etkinlikdolu</h2>
                                  </div>
                                  <h1 class="email-title">Merhaba <span>${userName}!</span></h1>
                                  <p class="lead">Aşağıdaki kodu alarak, etkinlikdolu.com üyeliğinizi onaylayabilirsiniz.</p>
                                  <p class="verification-code">${newUser.emailToken}</p>
                            </div>
                </div>
            </body>
            </html>
            `;
           
            const transporter = nodemailer.createTransport({
             host: "smtp.gmail.com",
             port: 465,
             secure: true,
             auth: {
               user: "etkinlikdolu@gmail.com",
               pass: "zcum cjum mzbn rgzv"
             }
            });
          
            const info = await transporter.sendMail({
             from: "etkinlikdolu@gmail.com",
             to: "kadirramazan344@gmail.com",
             subject: "Doğrulama Kodu, etkinlikdolu.com",
             html: html
            })
          
            console.log("Mesaj gönderildi: " + info.messageId)
          }
          
           main();
          
        
          // GİRİŞ YAP
          req.login(newUser, function(err) {
            if (err) {
              console.log(err);
              return next(err);
            }
            // Giriş başarılı, ana sayfaya yönlendir
            req.flash("success", `${userName}.`);
            return res.redirect('/user/registrationverify');
          });

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
  const token = req.body['g-recaptcha-response']
  const SECRET_KEY_v2 = process.env.RECAPTCHA_KEY;
  const recaptchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${SECRET_KEY_v2}&response=${token}`);
  let backUrl = req.session.returnTo ? req.session.returnTo : '/events'
  if(recaptchaResponse.data.success) {
    passport.authenticate('local', (err, user, info) => {
      if (err || !user) {
        let errorMessages;
        if (info && info.message && info.message.includes("Missing credentials")) {
          errorMessages = "Lütfen e-posta ve şifrenizi giriniz";
        } else {
          errorMessages = info ? info.message : "Bir hata oluştu";
        }
        req.flash("error", errorMessages)
        return res.redirect('/login');
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }  
        return res.redirect(backUrl)
      });

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
