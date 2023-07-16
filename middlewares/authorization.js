const connectToDb = require("../models/db")
const Event = require("../models/eventSchema")
const Notification = require("../models/notificationSchema")
const User = require("../models/userSchema")

const getUserInfo = async (req, res, next) => {
  try {
    await connectToDb();
    const currentUser = await User.findById(req.user.id)
    res.locals.user = currentUser || undefined;
    next();
  } catch (error) {
    res.locals.user = undefined;
    next(); // Hata yerine işleme devam etmek için `next()` kullanılıyor.
  }
  };


  // Middleware
  const getUserNotification = async (req, res, next) => {
      try {
        await connectToDb();
        // ETKİNLİK BİLDİRİMİNİ AL 
        const findNotification = req.user
          ? await Notification.find({ userId: req.user.id })
          : null;
        const sirala = req.user
          ? findNotification.map((notif) => {
              return [notif.message, notif.isNotificationSeen, notif._id];
            })
          : null;
        res.locals.notifications = sirala;
        next();
      } catch (error) {
        throw new Error(error);
      }
  
  
  

  };

const checkIfAuthed = (req,res,next) => {
    if(!req.isAuthenticated()) {
      res.redirect("/")
    } else {
      next()
    }
}

const checkIfNotAuthed = (req,res,next) => {
  if(req.isAuthenticated()) {
    res.redirect("/")
  } else {
    next()
  }
}


const authForNewEvent = (req,res,next) => {
      let user;
      if(res.locals.user && res.locals.user.membershipLevel) {
        user = res.locals.user.membershipLevel

        if(req.isAuthenticated() && user === "premium") {
          return next()
        } else {
          return res.redirect("/pricing")
        }
      } else {
        return res.redirect("/")
      }
    
}


  module.exports = {
    getUserInfo: getUserInfo,
    authForNewEvent: authForNewEvent,
    checkIfNotAuthed: checkIfNotAuthed,
    checkIfAuthed: checkIfAuthed,
    getUserNotification: getUserNotification
  }