const connectToDb = require("../models/db")
const Event = require("../models/eventSchema")
const User = require("../models/userSchema")
const Notification = require("../models/notificationSchema")
const sharp = require('sharp');
const fs = require("fs")
const WebSocket = require("ws");
const getDates = require("./getDates");
const mongoose = require("mongoose")

// WebSocket sunucusunu oluşturun
const wss = new WebSocket.Server({ port: 8080 });

// WebSocket bağlantılarını depolamak için bir dizi tanımlayın
const connections = [];

// WebSocket bağlantılarını yönetmek için yardımcı işlevler
function broadcastMessage(message) {
  connections.forEach((connection) => {
    connection.send(message);
  });
}

function handleWebSocketConnection(socket) {
  connections.push(socket);

  socket.on("message", (message) => {
    console.log("Received message:", message);
  });

  socket.on("close", () => {
    const index = connections.indexOf(socket);
    if (index !== -1) {
      connections.splice(index, 1);
    }
  });
}

wss.on("connection", handleWebSocketConnection);


module.exports.home_get = async (req,res) => {
    try {
        await connectToDb()
        // Eşleşen etkinlikleri bulmak için kullanılan sorgu
        const userId = req.user ? req.user.id : null

        if(userId) {
          const currentDate = new Date(); // Şu anki tarih ve zamanı al
          const matchingEvents = await Event.find({
            attendees: { _id : req.user.id},// Kullanıcı ID'sine sahip etkinlikleri getir
            status: 'active', // Durumu 'active' olan etkinlikleri getir
            date: { $gte: currentDate } // Bugünden sonraki tarihli etkinlikleri getir
        }).limit(3);

        res.locals.userEvents = matchingEvents;
       
        } else {
          res.locals.userEvents = undefined;
        }


        // TREND ETKINLIKLERI GONDER
        const currentDate = new Date();
        const trendingEvents = await Event.aggregate([
          // İlk olarak, ilgili etkinlikleri filtreleyin
          { $match: { date: { $gte: currentDate }, status: 'active' } },
          // Katılımcı sayısını hesaplayın
          { $project: { attendeesCount: { $size: "$attendees" }, doc: "$$ROOT" } },
          // En az 10 katılımcıya sahip olanları filtreleyin
          { $match: { attendeesCount: { $gte: 2 } } },
          // Sonuçları katılımcı sayısına göre sıralayın
          { $sort: { attendeesCount: -1 } },
          // İlk 5 sonucu alın
          { $limit: 5 },
          // İstenen döküman yapısını geri alın
          { $replaceRoot: { newRoot: "$doc" } }
        ]);
          if(trendingEvents) {
            res.locals.trendingEvents = trendingEvents;
          } else {
            res.locals.trendingEvents = [];
          }


          // FIND TREND CATEGORIES
          const allEvents = await Event.find({ date: { $gt: currentDate } }); // Sadece geçerli etkinlikleri al
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

           res.locals.popularCategories = popularCategories.length > 0 ? popularCategories : null
        

        const eventCategories = Event.schema.path('eventCategory').enumValues;
        res.locals.categories = eventCategories
        const successMessage = req.flash('success'); // Flash mesajını al
        res.locals.successMessage = successMessage;
        res.render("events.ejs")

        await new Promise ((resolve, reject) => {
          const data = req.app.locals.searchresults = {};
          resolve(data)
        })
    
    } catch (error) {
        throw new Error(error)
    }
}

module.exports.home_post = (req,res) => {
    req.app.locals.searchresults = {
        searchforevent: req.body.searchforevent,
        searchforeventlocation: req.body.searchforeventlocation
    }
    res.redirect("/events")
}

module.exports.newevent_get= (req,res) => {
        const eventCategories = Event.schema.path('eventCategory').enumValues;
        const usermembership = req.user ? req.user.membershipLevel : null;
        res.render("newevent.ejs", 
        {eventCategories: eventCategories,
          usermembership: usermembership
        })
}

module.exports.singular_event_get = async (req,res) => {
    try {
    await connectToDb()
    const eventId = req.params.id;
    const userId = req.user ? req.user.id : null;
    const event = await Event.findById(eventId);
    const checkUserAttend = event.attendees.some(attendee => attendee.equals(userId));
    const checkIfCurrentOrganizer = event.organizer.equals(userId);
    // ORGANIZER ID => MEVCUT ID İLE EŞLEŞİYORSA, 
    res.locals.checkIfCurrentOrganizer = checkIfCurrentOrganizer;
    res.locals.checkUserAttend = checkUserAttend;

    const findEvent = await Event.findById(req.params.id)
    const findOrganizer = await User.findById(findEvent.organizer) 
  
    const findAttendeeUsers = await User.find({ _id: { $in: findEvent.attendees } });
    const eventCategory = findEvent.eventCategory;
    const eventCity = findEvent.cityName;

  
  // findEvent.attendees içerisindeki kullanıcı kimliklerini bir dizi olarak alın
  const attendeeIds = findEvent.attendees;
  // findAttendeeUsers dizisini, findEvent.attendees içerisindeki sıralamaya göre yeniden düzenleyin
  const reorderedAttendeeUsers = attendeeIds.map(id => findAttendeeUsers.find(user => user.id.toString() === id.toString()));
  

    const findSimilarEvents = await Event.find({
      eventCategory: eventCategory, // Aynı kategoriye sahip
      cityName: eventCity, // Aynı şehire sahip
      _id: { $ne: req.params.id }, // Şu anki etkinliği dışarıda bırak
  }).limit(4); // En fazla 5 etkinliği al
    res.render('event.ejs', {
      findEvent: findEvent,
       findOrganizer: findOrganizer,
       findAttendeeUsers: reorderedAttendeeUsers,
       findSimilarEvents: findSimilarEvents
      })
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.add_attendees_post = async (req, res) => {
    try {
      const eventId = req.params.id;
      const userId = req.user ? req.user.id : null; // Kullanıcının kimliğini alın (oturum açmış olduğunu varsayıyoruz)
      const message = "Kurduğunuz etkinliğe yeni biri katıldı!";

      
      broadcastMessage(JSON.stringify({ eventId, message }));
     // ETKİNLİK SAHİBİNİ BUL
     const eventOwner = await Event.findById(eventId).populate("organizer");
      // Etkinliği bulun
      const event = await Event.findById(eventId);
  
      // Kullanıcının "free" üyelik düzeyine sahip olup olmadığını kontrol edin
      const user = await User.findById(userId);
      if(user !== null) {
        if (user.membershipLevel === 'free' && event.attendees.length >= 10) {
          // "free" üyelik düzeyine sahip kullanıcı için katılımcı sınırlaması kontrolü
          req.flash('error', 'Katılımcı sınırına ulaşıldı.');
          return res.redirect(`/events/${eventId}`);
        }
          // EĞER USER NULL DEĞİLSE || YANİ VARSA BİLDİRİM OLUŞTUR
        try {
          // Etkinlik sahibine bildirim oluştur
         await Notification.create({
            userId: eventOwner.organizer._id,
            isNotificationSeen: false,
            message: message
          });
        } catch (error) {
          throw new Error(error)
        }
      } else {
          return res.redirect(`/login`);
      }
     
      if (event.attendees.includes(userId)) {
        req.flash('error', 'Zaten bu etkinliğe katıldınız.');
        return res.redirect(`/events/${eventId}`);
      }
  
      // Kullanıcının etkinliğe katılmasını sağlayın
      event.attendees.push(userId);
  
      // Etkinlik kaydedin
      await event.save();
  
      req.flash('success', 'Etkinliğe başarıyla katıldınız.');
      res.redirect(`/events/${eventId}`);
    } catch (error) {
      throw new Error(error);
    }
  };

module.exports.remove_attendee_post = async (req,res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;
        
        // Etkinliği bulun
        const event = await Event.findById(eventId);
        
        // Kullanıcının etkinlikte olup olmadığını kontrol edin
        const index = event.attendees.indexOf(userId);
        if (index === -1) {
          // Kullanıcı etkinlikte değil, hata mesajı gösterin veya yönlendirme yapın
          req.flash('error', 'Kullanıcı etkinlikte bulunamadı.');
          return res.redirect(`/events/${eventId}`);
        }
        
        // Kullanıcıyı etkinlikten çıkarın
        event.attendees.splice(index, 1);
        
        // Etkinliği kaydedin
        await event.save();
        
        res.redirect(`/events/${eventId}`);
      } catch (error) {
        throw new Error(error);
      }
}

module.exports.cancel_event_post = async (req,res) => {
  const organizerId = req.user.id; // Organizatör kullanıcının kimliği
    const eventId = req.params.id; // İptal edilmek istenen etkinliğin kimliği

    try {
        // İptal edilmek istenen etkinliği bulma
        const event = await Event.findById(eventId);

        // Eğer etkinlik bulunamazsa veya organizatör kullanıcı etkinliği iptal etme yetkisine sahip değilse
        if (!event || !event.organizer.equals(organizerId)) {
            return res.status(404).json({ error: "Etkinlik bulunamadı veya iptal etme yetkiniz yok." });
        }

        // Etkinliği iptal etme
        event.status = "cancelled"; // Örnek olarak etkinliğin durumunu "iptal edildi" olarak güncelleme
        await event.save();

        // Başarılı bir yanıt döndürme
        req.flash("success", "Etkinliğiniz başarıyla iptal edildi!");
        res.redirect("/user/profile?etkinliklerim");
    } catch (error) {
        console.error("Etkinlik iptal edilirken bir hata oluştu:", error);
        return res.status(500).json({ error: "Etkinlik iptal edilirken bir hata oluştu." });
    }
}

// DATE SETTINGS
const {getDate, getTomorrowDate, getWeekRange, getWeekendRange, getNextWeekRange} = getDates

module.exports.getEventsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    if(date === "Bugün") {
      const formattedDate = getDate();
      const dateObjFormat = new Date(formattedDate);
      const currentHour = formattedDate.substring(11, 16);

      const events = await Event.find({ date: { $gte: dateObjFormat } }).limit(40); // Belirtilen tarihten sonraki etkinlikleri getirir
  
     const filteredData = events.filter((event) => {
        const turkiyeZamanDilimi = new Date(event.date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
        const eventSaat = String(turkiyeZamanDilimi.getHours()).padStart(2, '0');
        const eventDakika = String(turkiyeZamanDilimi.getMinutes()).padStart(2, '0');
    
        const isSameDay = turkiyeZamanDilimi.toDateString() === dateObjFormat.toDateString();
        const isLaterTime = `${eventSaat}:${eventDakika}` > currentHour;
    
        return isSameDay && isLaterTime;
      });
  
      res.json(filteredData);
    }  else if (date === "Yarın") {
      const formattedDate = getTomorrowDate();
      const dateObjFormat = new Date(formattedDate);

      const events = await Event.find({ date: { $gte: dateObjFormat } }).limit(40);


      const filteredData = events.filter((event) => {
        const turkiyeZamanDilimi = new Date(event.date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
        const isSameDay = turkiyeZamanDilimi.toDateString() === dateObjFormat.toDateString();
        return isSameDay 
      });

      res.json(filteredData);
    } else if (date === "Bu Hafta") {
      const { startOfWeek, endOfWeek } = getWeekRange();

      const events = await Event.find({ 
        date: { 
          $gte: startOfWeek, // Bu hafta başlangıç tarihinden büyük veya eşit olan
          $lte: endOfWeek     // Bu hafta bitiş tarihinden küçük veya eşit olan
        } 
      }).limit(40);
    
      const filteredData = events.filter((event) => {
        const turkiyeZamanDilimi = new Date(event.date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
    
        const isWithinWeek = turkiyeZamanDilimi >= startOfWeek && turkiyeZamanDilimi <= endOfWeek;
        const isLaterTime = turkiyeZamanDilimi > new Date();
    
        return isWithinWeek && isLaterTime;
      });

      res.json(filteredData);
    } else if (date === "Bu Haftasonu") {
      const { startOfWeekend, endOfWeekend } = getWeekendRange();

      const events = await Event.find({ 
        date: { 
          $gte: startOfWeekend, // Bu hafta başlangıç tarihinden büyük veya eşit olan
          $lte: endOfWeekend     // Bu hafta bitiş tarihinden küçük veya eşit olan
        } 
      }).limit(40);

      const filteredData = events.filter((event) => {
        const turkiyeZamanDilimi = new Date(event.date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));

        const isWithinWeek = turkiyeZamanDilimi >= startOfWeekend && turkiyeZamanDilimi <= endOfWeekend;
        const isLaterTime = turkiyeZamanDilimi > new Date();

         return isWithinWeek && isLaterTime;
      });
      res.json(filteredData);
    } else if (date === "Önümüzdeki Hafta") {
      const {startOfWeek, endOfWeek} = getNextWeekRange();

      const events = await Event.find({ 
        date: { 
          $gte: startOfWeek, // Bu hafta başlangıç tarihinden büyük veya eşit olan
          $lte: endOfWeek     // Bu hafta bitiş tarihinden küçük veya eşit olan
        } 
      }).limit(40);

      const filteredData = events.filter((event) => {
        const turkiyeZamanDilimi = new Date(event.date.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));

        const isWithinWeek = turkiyeZamanDilimi >= startOfWeek && turkiyeZamanDilimi <= endOfWeek;
        const isLaterTime = turkiyeZamanDilimi > new Date();

        return isWithinWeek && isLaterTime;
      });
      res.json(filteredData);
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Belirli bir kategoriye göre etkinlikleri filtreleyen kontrolcü
module.exports.getEventsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Kategoriye göre etkinlikleri veritabanından sorgula
    const events = await Event.find({ eventCategory: category });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports.notifications_get = async (req,res) => {
  try {
    await connectToDb()
    const getNotif = await Notification.find({})
    res.send(getNotif)
  } catch (error) {
    throw new Error(error)
  }

}

module.exports.getNotificationById = async (req,res) => {
   try {
    const id = req.params.id;
    await connectToDb();
    const updatedNotif = await Notification.findOneAndUpdate(
      { _id: id },
      { $set: { isNotificationSeen: true } },
      { new: true }
    );
    res.send(updatedNotif)
   } catch (error) {
    res.status(500).send({ error: "Internal Server Error" });
   }
 
}
  
  

module.exports.newevent_post = async (req,res, err) => {
    try {
        await connectToDb()
         
        const resizedImageBuffer = await sharp(req.file.path)
            .resize(213, 142, {fit: "cover", background: { r: 255, b: 255, g: 255 } })
            .toBuffer();

        // Yeni boyutlandırılmış görüntüyü dosyaya yaz
        fs.writeFile('./uploads_little/' + req.file.filename, resizedImageBuffer, (err) => {
            if (err) {
              console.log("cs " + err);
              return
            }
        });


            const largeImage = await sharp(req.file.path)
            .resize(661, 372, {fit: "cover", background: { r: 255, b: 255, g: 255 } })
            .toBuffer();

          // Yeni boyutlandırılmış görüntüyü dosyaya yaz
          fs.writeFile('./uploads/' + req.file.filename, largeImage, (err) => {
              if (err) {
                console.log("cs " + err);
                return
              }

          });

          const newEvent = await Event.create({
            title: req.body.eventPostTitle,
            description: req.body.eventPostDescription,
            cityName: req.body.cityname,
            districtName: req.body.getDistrictName,
            fullAddress: req.body.fulladress,
            date: req.body.eventPostDate,
            eventImage: req.file.path,
            participantLimit: req.body.getEventPartLimit,
            organizer: res.locals.user.id,
            eventCategory: req.body.getEventCategory
        })
  
        newEvent.attendees.push(req.user.id);
          await newEvent.save();
      
          req.flash('success', 'Etkinliğiniz başarıyla oluşturuldu.');
          res.redirect("/events");
    } catch (error) {
      res.redirect("/events/newevent")
    }
}