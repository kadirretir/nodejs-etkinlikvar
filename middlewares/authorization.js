
const getUserInfo = (req, res, next) => {
    res.locals.user = req.user;
    next();
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
    checkIfAuthed: checkIfAuthed
  }