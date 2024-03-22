const express = require("express")
const app = express()
const authRoutes = require("./routes/auth")
const eventRoutes = require("./routes/events")
const userRoutes = require("./routes/user")
const memberRoutes = require("./routes/members")
const flash = require("express-flash")
const passport = require('passport');
const MongoStore = require("connect-mongo")
const session = require("express-session")
const authMiddleware = require("./middlewares/authorization")
const methodOverride = require('method-override')
const path = require('path');
const connectToDb = require("./models/db")
const Event = require("./models/eventSchema")
const User = require("./models/userSchema")
const Complaint = require("./models/complaintsSchema")
const cloneDocument = require("./models/cloneDocuments")
require('dotenv').config();

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static('public'))

app.use('/events', express.static('public'))
app.use('/events', express.static('dist'))

app.set('views', path.join(__dirname, 'views'));
app.use(express.static('dist'));

app.use('/user', express.static('public'))
app.use('/user', express.static('dist'))

app.use('/members', express.static('public'))
app.use('/members', express.static('dist'))

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads_little', express.static(path.join(__dirname, 'uploads_little')));
app.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: "Session",
        ttl: 10000
    })
}));
app.use(passport.authenticate('session'));
app.use(methodOverride('_method'))
app.use(authMiddleware.getUserInfo)
app.use(authMiddleware.getUserNotification)
app.use(flash());
// cloneDocument(9);

const {checkIfAuthed} = authMiddleware;

app.use("/auth", authRoutes)
app.use("/events", eventRoutes)
app.use("/user", checkIfAuthed, userRoutes)
app.use("/members", memberRoutes)

// FIND IP ADDRESS
app.use(async (req, res, next) => {
  const ip = 
    req.headers['cf-connecting-ip'] ||
    req.headers['x-real-ip'] || 
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress || '';

  const findLocation = await fetch(`https://geolocation-db.com/json/${process.env.LOCATION_KEY}${ip ? '/' + ip : ''}`);
  const response = await findLocation.json();

  req.app.locals.usercity = response.city
  next();
});



app.get("/", async (req,res) => {
    try {
      await connectToDb()
      // ŞU ANDAN İTİBAREN 10 GÜN İÇERİSİNDEKİ ETKİNLİKLERİ AL
      const currentDate = new Date();
      currentDate.setSeconds(0, 0); 

      const nextTenDays = new Date();
      nextTenDays.setDate(nextTenDays.getDate() + 10);
      nextTenDays.setHours(23, 59, 59, 999); // Son saat ve dakikayı ayarla

      const events = await Event.find({ 
        status: { $ne: "cancelled" }, // Statusu "cancelled" olan etkinlikleri almayacağız
        $or: [
            { date: { $gt: currentDate } }, // Tarihi bugünün tarihinden büyük olan etkinlikleri al
            { date: currentDate, hour: { $gte: currentDate.getHours() } } // Bugünün tarihine eşit olan ve saati şu andan büyük olan etkinlikleri al
        ]
    }).limit(8).populate("organizer attendees");
    

   
    // Kategorilerin sayımlarını yap
    const allEvents = await Event.find({ 
        status: { $ne: "cancelled" }, // Statusu "cancelled" olan etkinlikleri almayacağız
        $or: [
            { date: { $gt: currentDate } }, // Tarihi bugünün tarihinden büyük olan etkinlikleri al
            { date: currentDate, hour: { $gte: currentDate.getHours() } } // Bugünün tarihine eşit olan ve saati şu andan büyük olan etkinlikleri al
        ]
    }); // Sadece geçerli etkinlikleri al
     // Kategori sayımlarını tutmak için bir obje
    const categoryCounts = {};

    allEvents.forEach((event) => {
          const category = event.eventCategory;
          if (categoryCounts[category]) {
            categoryCounts[category]++;
          } else {
            categoryCounts[category] = 1;
          }
        });
      // Sayımlara göre kategorileri sırala
      const sortedCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);
      // En fazla 6 kategori al
      const popularCategories = sortedCategories.slice(0, 6);

      res.render("index.ejs", {events: events, eventCategories: popularCategories})
    } catch (error) {
      throw new Error(error)
    }
})

// PRICING
app.get("/pricing", (req,res) => {
  res.render("pricing.ejs")
})

// LOGIN
app.get("/login", authMiddleware.checkIfNotAuthed, (req,res) => {
  if(req.session.returnTo && req.session.returnTo.includes("member")) {
    return res.render("login.ejs");
  }
  req.session.returnTo = req.headers.referer || '/';
  return res.render("login.ejs")
})


// COMPLAINTS
app.get("/complaints", (req,res) => {
  res.render("complaints.ejs", { flash: req.flash() })
})
app.post("/complaint", async (req,res) => {
  try {
    const { complainterName, complaintDescription, complaintCategory } = req.body;
    
    if (!complainterName || !complaintDescription || !complaintCategory) {
       req.flash('error', 'Lütfen gerekli alanları doldurunuz...');
       return res.redirect("/complaints")
    }

    await connectToDb()
    await Complaint.create({
      name: complainterName,
      description: complaintDescription,
      type: complaintCategory
    })

    req.flash('success', 'Geri bildiriminizi başarıyla aldık. Özenle inceleyeceğiz.');
    return res.redirect("/complaints")
  } catch (error) {
    req.flash('error', 'Bir hata oluştu.');
    throw new Error(error)
  }
})


app.use(function (req,res,next) {
  res.status(404).render('404.ejs')
  })
  

app.listen(3000)