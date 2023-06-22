const express = require("express")
const app = express()
const authRoutes = require("./routes/auth")
const eventRoutes = require("./routes/events")
const flash = require("express-flash")
const passport = require('passport');
const MongoStore = require("connect-mongo")
const session = require("express-session")
const authMiddleware = require("./middlewares/authorization")
const methodOverride = require('method-override')
const path = require('path');
const getLocation = require("./middlewares/geoLocation")

app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
app.use('/events', express.static('public'))
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('dist'));
app.use('/events', express.static('dist'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
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
app.get("/", (req,res) => {
     res.render("index.ejs")
})
app.get("/pricing", (req,res) => {
  res.render("pricing.ejs")
})
app.get("/login", authMiddleware.checkIfNotAuthed, (req,res) => {
  res.render("login.ejs")
})

app.listen(3000)