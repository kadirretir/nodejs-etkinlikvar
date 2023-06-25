const connectToDb = require("../models/db")
const Event = require("../models/eventSchema")
const User = require("../models/userSchema")
const sharp = require('sharp');
const fs = require("fs")

module.exports.home_get = async (req,res) => {
    try {
        await connectToDb()
        const events = await Event.find({})
        const eventCategories = Event.schema.path('eventCategory').enumValues;
        res.locals.categories = eventCategories
        res.locals.events = events
        res.render("events.ejs")
        await new Promise ((resolve, reject) => {
          const data = req.app.locals.searchresults = {}
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
        res.render("newevent.ejs", {eventCategories: eventCategories})
}

module.exports.singular_event_get = async (req,res) => {
    try {
    await connectToDb()
    const eventId = req.params.id;
    const userId = req.user ? req.user.id : null;
    const event = await Event.findById(eventId);
    const checkUserAttend = event.attendees.some(attendee => attendee.equals(userId));
    res.locals.checkUserAttend = checkUserAttend;

    const findEvent = await Event.findById(req.params.id)
    const findOrganizer = await User.findById(findEvent.organizer) 
    const findAttendeeUsers = await User.find({ _id: { $in: findEvent.attendees } });
   
    res.render('event.ejs', {
      findEvent: findEvent,
       findOrganizer: findOrganizer,
       findAttendeeUsers: findAttendeeUsers
      })
    } catch (error) {
        throw new Error(error);
    }
}

module.exports.add_attendees_post = async (req, res) => {
    try {
      const eventId = req.params.id;
      const userId = req.user ? req.user.id : null; // Kullanıcının kimliğini alın (oturum açmış olduğunu varsayıyoruz)
  
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

module.exports.requested_events_get = async (req,res) => {
  try {
    await connectToDb()
    const data = await Event.find({})
    res.send(data)
  } catch (error) {
      throw new Error(error)
  }
}

module.exports.getEventByTitle = async (req,res) => {
  try {
    const title = req.params.title;

    await connectToDb();
    const events = await Event.find({ title: { $regex: title, $options: "i" } });
    res.send(events);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
 
}
  
  

module.exports.newevent_post = async (req,res) => {
    try {
        await connectToDb()
         
        const resizedImageBuffer = await sharp(req.file.path)
            .resize(213, 142, {fit: "cover", background: { r: 255, b: 255, g: 255 } })
            .toBuffer();

        // Yeni boyutlandırılmış görüntüyü dosyaya yaz
        fs.writeFile('./uploads_little/' + req.file.filename, resizedImageBuffer, (err) => {
            if (err) {
                throw new Error(err);
            }
            console.log('Dosya kaydedildi!');
        });


            const largeImage = await sharp(req.file.path)
            .resize(661, 372, {fit: "cover", background: { r: 255, b: 255, g: 255 } })
            .toBuffer();

          // Yeni boyutlandırılmış görüntüyü dosyaya yaz
          fs.writeFile('./uploads/' + req.file.filename, largeImage, (err) => {
              if (err) {
                  throw new Error(err);
              }
              console.log('Dosya kaydedildi!');
          });
        await Event.create({
            title: req.body.eventPostTitle,
            description: req.body.eventPostDescription,
            location: req.body.eventPostLocation,
            date: req.body.eventPostDate,
            eventImage: req.file.path,
            organizer: res.locals.user.id,
            eventCategory: req.body.getEventCategory
        })
        res.redirect("/events")
    } catch (error) {
        throw new Error(error)
    }
}