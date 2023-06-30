const connectToDb = require("../models/db")
const Event = require("../models/eventSchema")
const Notification = require("../models/notificationSchema")

const getUserInfo = (req, res, next) => {
    res.locals.user = req.user;
    next();
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
      if(res.locals.user && res.locals.user.membership) {
        user = res.locals.user.membership

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