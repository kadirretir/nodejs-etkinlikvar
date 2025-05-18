const connectToDb = require("../models/db")
const User = require("../models/userSchema")
const Event = require("../models/eventSchema")


module.exports.individual_member_get = async (req,res) => {
    try {
        await connectToDb();
        // İlgili kullanıcıyı gönder
        const findUser = await User.findOne({ _id: req.params.id})

        // Güncel Kullanıcı Eventlerini Gönder
        const currentDateTime = new Date();
        const events = await Event.find({
          organizer: findUser.id,
          status: { $ne: 'cancelled' },
          date: { $gt: currentDateTime }
        });

        // Kullanıcının bugune  kadar kurdugu tum etkınlıklerin sayısı
        const totalEventsCount = await Event.countDocuments({ organizer: findUser.id });

        // TIKLANILAN KULLANICIYI BACK-URL OLARAK LOGIN-POST'A GÖNDER
        const backUrl  = `https://nodejs-etkinlikvar.onrender.com/members/${req.params.id}`
        if(req.user) {
            res.render("publicprofile.ejs", {findUser: findUser, events: events, hostedEvents: totalEventsCount})
        } else {
            // Kullanıcı giriş yapmadıysa, backUrl'i returnTo olarak ayarla
            req.session.returnTo = backUrl;
            res.redirect("/login");
        }
    } catch (error) {
        
    }

}