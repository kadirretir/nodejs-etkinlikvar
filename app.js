const express = require("express")
const app = express()
const authRoutes = require("./routes/auth")
const eventRoutes = require("./routes/events")
const userRoutes = require("./routes/user")
const flash = require("express-flash")
const passport = require('passport');
const MongoStore = require("connect-mongo")
const session = require("express-session")
const authMiddleware = require("./middlewares/authorization")
const methodOverride = require('method-override')
const path = require('path');
const getLocation = require("./middlewares/geoLocation")
const connectToDb = require("./models/db")
const Event = require("./models/eventSchema")
const User = require("./models/userSchema")

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use('/events', express.static('public'))
app.use('/events', express.static('dist'))
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('dist'));
app.use('/user', express.static('public'))
app.use('/user', express.static('dist'))
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





app.use(async (req, res, next) => {
  try {
    const location = await getLocation();
    req.location = location;
    next();
  } catch (error) {
    console.error('Error retrieving location:', error);
    next(error);
  }
});




app.use("/auth", authRoutes)
app.use("/events", eventRoutes)
app.use("/user", authMiddleware.checkIfAuthed, userRoutes)
app.get("/", async (req,res) => {
    try {
      await connectToDb()
      const events = await Event.find({}).populate("organizer");

      const categoryCounts = {}; // Kategori sayımlarını tutmak için bir obje

// Kategorilerin sayımlarını yap
    events.forEach((event) => {
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

console.log(popularCategories); // En fazla 6 kategori
      res.render("index.ejs", {events: events, eventCategories: popularCategories})
    } catch (error) {
      throw new Error(error)
    }
})
app.get("/pricing", (req,res) => {
  res.render("pricing.ejs")
})
app.get("/login", authMiddleware.checkIfNotAuthed, (req,res) => {
  res.render("login.ejs")
})

app.listen(3000)