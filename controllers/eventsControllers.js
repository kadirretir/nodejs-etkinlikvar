const connectToDb = require("../models/db")
const Event = require("../models/eventSchema")
const User = require("../models/userSchema")
const Notification = require("../models/notificationSchema")
const sharp = require('sharp');
const fs = require("fs")
const {getTodaysEvents,
   getTomorrowsEvents, 
   getThisWeeksEvents, 
   getThisWeekendEvents,
    getNextWeekEvents} = require("./eventsDateFuncs")
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ port: 8080 });

    const authorizedUsers = [];

    function createChatRoom(attendees) {
      // Her katılımcı için WebSocket bağlantısını işleyin
      authorizedUsers.push(...attendees);
    }

    wss.on('connection', (ws, req) => {
      const userId = req.url.split('?userId=')[1];

      // Kullanıcı kimliğini doğrulayın ve yetkili olup olmadığını kontrol edin
      if (!authorizedUsers.includes(userId)) {
        ws.close(); // Yetkisiz kullanıcıysa bağlantıyı kapatın
        return;
      }
      ws.userId = userId;
      // Bağlantı olaylarını işleyin


      ws.onmessage = (event) => {
        const message = event.data;
        console.log('Mesaj alındı:', message, 'Kullanıcı:', ws.userId);
    
    
   
        // Mesajı sohbet odasındaki diğer kullanıcılara yayınlayın
        wss.clients.forEach(client => {
      
          if (client.readyState === WebSocket.OPEN && client.userId !== ws.userId) {
        
            client.send(message);
          }
        });
      };
      ws.onclose = () => {
        console.log('WebSocket bağlantısı kapatıldı.');
      };
    });


function validateSearchTerm(term) {
  // Türkçe karakterler, boşluklar ve noktalama işaretlerini de içeren genişletilmiş regex
  return /^[\p{L}0-9\s.,!?]*$/u.test(term);
}


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

           res.locals.popularCategories = popularCategories.length > 0 ? popularCategories : null

             // SEARCH RESULTS FOR GENERAL SEARCH QUERY
               // Veritabanına bağlan
               let generalSearchResults;
               if (req.query.searchquery) {
                 // searchTerm yerine doğrudan req.query.searchquery kullanın
                 if (!validateSearchTerm(req.query.searchquery)) {
                   return res.redirect("/")
                 } else {
                   const searchQuery = {
                     $text: {
                       $search: req.query.searchquery.toLocaleUpperCase('TR'),
                     }
                   };
                   generalSearchResults = await Event.find({
                    $and: [
                      searchQuery, // Mevcut arama sorgusu
                      { 
                        status: { $ne: "cancelled" }, // "cancelled" olmayan etkinlikler
                        date: { $gt: new Date() } // Geçmemiş tarihli etkinlikler
                      }
                    ]
                  }).exec();
                 }
               }


        const eventCategories = Event.schema.path('eventCategory').enumValues;
        res.locals.categories = eventCategories
        const successMessage = req.flash('success'); // Flash mesajını al
        res.locals.successMessage = successMessage;

        const searchresults = req.flash('searchresults');
        const interestsearch = req.flash('interestsearch');
        const usercity = req.app.locals.usercity ? req.app.locals.usercity : '';

        res.render("events.ejs",
         { searchresults: searchresults[0] || {},
          interestsearch: interestsearch[0] || {},
          generalSearchResults: generalSearchResults,
          usercity:usercity
        });
    } catch (error) {
        res.status(404).render("404.ejs")
    }
}

module.exports.home_post = (req,res) => {
    req.flash('searchresults', {
      searchforevent: req.body.searchforevent,
      searchforeventlocation: req.body.searchforeventlocation
    });

    req.flash('interestsearch', {
      interest: req.body.interest
    })
   
    if(req.body.fromFooter) {
      res.json({redirect: '/events'})
    } else {
      res.redirect("/events")
    }
}

module.exports.newevent_get= (req,res) => {
    const usermembership = req.user ? req.user.membershipLevel : null;
    res.render("newevent.ejs", {usermembership: usermembership})
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
  
    const findAttendeeUsers = await User.find({ _id: { $in: findEvent.attendees } }).select("-password")
    const authorizedUsers = findAttendeeUsers.map(user => user.id.toString());

  // Sohbet odası oluşturun (authorizedUsers dizisini kullanarak)
  createChatRoom(authorizedUsers);

    
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
        res.status(404).render("404.ejs")
    }
}

module.exports.add_attendees_post = async (req, res) => {
    try {
      const eventId = req.params.id;
      const userId = req.user ? req.user.id : null; // Kullanıcının kimliğini alın (oturum açmış olduğunu varsayıyoruz)  
         // Etkinlik sahibinin ve katılan kullanıcının bilgilerini alın
           const [eventOwner, user] = await Promise.all([
            Event.findById(eventId).populate("organizer"),
            User.findById(userId)
        ]);

        if (!user) {
            return res.redirect(`/login`);
        }

        // Bildirim mesajını oluştur
        const message = `${user.username} kurduğunuz etkinliğe katıldı!`;
       
    //  // ETKİNLİK SAHİBİNİ BUL
    //  const eventOwner = await Event.findById(eventId).populate("organizer");
    //   // Etkinliği bulun
   const event = await Event.findById(eventId);
  
    //   // Kullanıcının "free" üyelik düzeyine sahip olup olmadığını kontrol edin
    //   const user = await User.findById(userId);
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
        res.redirect("/user/profile");
    } catch (error) {
        console.error("Etkinlik iptal edilirken bir hata oluştu:", error);
        return res.status(500).json({ error: "Etkinlik iptal edilirken bir hata oluştu." });
    }
}


module.exports.getEventsByDate = async (req, res) => {
  try {
    const { eventsIds, date } = req.body; // Front-end'den gelen veriler
      let filteredEvents = [];
        // Front-end'den gelen verileri kullanarak filtreleme yap
        if(date === "Bugün") {
          filteredEvents = await getTodaysEvents(eventsIds)
          res.json(filteredEvents);
        } else if (date === "Yarın") {
          filteredEvents = await getTomorrowsEvents(eventsIds)
          res.json(filteredEvents);
        } else if (date === "Bu Hafta") {
          filteredEvents = await getThisWeeksEvents(eventsIds)
          res.json(filteredEvents);
        } else if (date === "Bu Haftasonu") {
          filteredEvents = await getThisWeekendEvents(eventsIds)
          res.json(filteredEvents);
        } else if (date === "Önümüzdeki Hafta") {
         filteredEvents = await getNextWeekEvents(eventsIds)
         res.json(filteredEvents);
        }

  } catch (error) {
    console.log(error)
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
            eventCategory: req.body.eventCategory,
            eventSubCategory: req.body.eventSubCategory
        })
  
        newEvent.attendees.push(req.user.id);
          await newEvent.save();
      
          req.flash('success', 'Etkinliğiniz başarıyla oluşturuldu.');
          res.redirect("/events");
    } catch (error) {
      console.log(error)
      res.redirect("/events/newevent")
    }
}


module.exports.general_search_post = async (req, res) => {
    const resultsString = encodeURIComponent(req.query);
    // İstemciyi sonuçlarla birlikte /events sayfasına yönlendir
    res.redirect(`/events?searchResults=${resultsString}`);
  
};

