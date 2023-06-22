const connectToDb = require("../models/db")
const Event = require("../models/eventSchema")
const User = require("../models/userSchema")

module.exports.home_get = async (req,res) => {
    try {
        await connectToDb()
        const events = await Event.find({})
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
  

    res.render('event.ejs', {findEvent: findEvent, findOrganizer: findOrganizer})
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
        if (user.membershipLevel === 'free' && event.attendees.length >= 3) {
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
  

module.exports.newevent_post = async (req,res) => {
    try {
        await connectToDb()
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