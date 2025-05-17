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
const cloneDocument = require("./models/cloneDocuments")
const cors = require("cors")
require('dotenv').config();
const nodemailer = require('nodemailer');
const http = require("http");
const { initWebSocket } = require('./controllers/eventsControllers');
  

const server = http.createServer(app); // 🔑 ortak server


const PORT = process.env.PORT || 3000;

initWebSocket(server); // wss created here 

app.use(cors())



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



app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
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
//  cloneDocument(8);


const {checkIfAuthed} = authMiddleware;

const setDynamicMeta = async (req, res, next) => {
  // İstek yapılan URL'nin pathname'ini al
  const pathname = req.path;
  // Pathname'e göre dinamik başlık ve meta oluştur
  let title, description;



  function sonrakiKisim (pathname)  {
    var sonrakiKisim = pathname.split('/events/')[1];

    return sonrakiKisim;
  }
  // check if individual event page has open
  function kontrolEt (pathname) {
      var kisim = sonrakiKisim(pathname)
    if (kisim && kisim.length === 24) {
        return true;
    } else {
        return false;
    }
}

async function findCity (pathname) {
  var kisim = sonrakiKisim(pathname)
  try {
    await connectToDb()
    const cityName = await Event.findById({_id: kisim}).select("cityName districtName title")
    return cityName
  } catch (error) {
    res.status(404)
  }
}

  if (pathname === '/') {
      title = "Etkinlikdolu - Yerel Konumunuzda Yapılacak Etkinlikleri Keşfedin";
      description = "Hayatınızı renklendirecek etkinlikler burada! En popüler konserlerden, yerel sanat sergilerine, eğitici seminerlerden eğlenceli festivallere kadar geniş bir yelpazede etkinlikleri keşfedin. Sizin için mükemmel olan etkinliği bulun ve yeni deneyimlere yelken açın."
    } else if (pathname === '/events/') {
        title = "Yerel Bölgenizdeki Etkinlikleri Keşfedin - Konser, Atölye, Buluşma";
        description = "Etkinliklerin ritmine kapılın! Sıradanlıktan sıyrılıp, müzikten sanata, bilimden spora her zevke hitap eden etkinliklerle dolu bir dünyaya adım atın. Hayalinizdeki etkinliği keşfedin, kaydınızı yapın, maceraya atılın!";
    } else if (pathname.includes("/events/") && kontrolEt(pathname)) {
      const city = await findCity(pathname)
      title = `Etkinlikdolu - ${city.cityName}, ${city.districtName} - ${city.title}`
      description = `Bölgenizdeki heyecan verici etkinlikleri keşfedin! ${city.cityName} şehrinde ${city.districtName} bölgesinde ${city.title} etkinliği sizleri bekliyor. Detaylar için hemen göz atın!`;
  }  else if (pathname === '/user/profile') { 
    title = "Profilim";
    description = "Profil";
  } else if (pathname.includes("/members")) { 
    title = "Profil Sayfası";
    description = "Profil";
  } else if (pathname === '/help') { 
    title = "Etkinlikdolu - Yardım";
    description = "Profil";
  } else if (pathname === "/complaints") {
    title = "Etkinlikdolu - Öneri ve Şikayet";
    description = "Profil";
  } else {
      title = "Etkinlikdolu";
      description = "Üzgünüz, aradığınız sayfa bulunamadı.";
  }

  // response objesine dinamik başlık ve açıklamayı ekle
  res.locals.metaTitle = title;
  res.locals.metaDescription = description;

  // Middleware'in sonraki adıma geçmesi için next() fonksiyonunu çağır
  next();
};

// Middleware'i uygula
app.use(setDynamicMeta);

app.use("/auth", authRoutes)
app.use("/events", eventRoutes)
app.use("/user", checkIfAuthed, userRoutes)
app.use("/members", memberRoutes)



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


app.post("/complaint", (req,res) => {
  try {
    const { complainterName, complaintDescription, complaintCategory, complaintSubject } = req.body;
    
    if (!complainterName || !complaintDescription || !complaintCategory) {
       req.flash('error', 'Lütfen gerekli alanları doldurunuz...');
       return res.redirect("/complaints")
    }

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
      
      </head>
      <body>
          <div class="container">
              <h1 class="mb-3">${complaintCategory}</h1>
              <p class="my-2">${complainterName}</p>
              <p class="my-2">${complaintDescription}</p>
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
         pass: "esah rzzf rkep wabi"
       }
      });
    
      const info = await transporter.sendMail({
       from: "etkinlikdolu@gmail.com",
       to: "etkinlikdolu@gmail.com",
       subject: complaintSubject,
       html: html
      })
    }
    
     main();




    req.flash('success', 'Geri bildiriminizi başarıyla aldık. Özenle inceleyeceğiz.');
    return res.redirect("/complaints")
  } catch (error) {
    req.flash('error', 'Bir hata oluştu.');
    res.status(500).send("Mesaj gönderilirken bir hata oluştu.");
  }
})

app.get("/help", (req,res) => {
  res.render("help.ejs")
})

app.get("/privacypolicy", (req,res) => {
  res.render("privacypolicy.ejs")
})

app.get("/termsofservice", (req,res) => {
  res.render("termsofservice.ejs")
})

app.get("/userpolicy", (req,res) => {
  res.render("userpolicy.ejs")
})




app.use(function (req,res,next) {
  res.status(404).render('404.ejs')
  })


  

server.listen(PORT, () => {
  console.log(`server ${PORT} portunda çalışıyor!`)
})