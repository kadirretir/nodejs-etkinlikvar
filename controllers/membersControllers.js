const connectToDb = require("../models/db")
const User = require("../models/userSchema")

module.exports.individual_member_get = async (req,res) => {
    try {
        await connectToDb();
 
        const findUser = await User.findOne({ _id: req.params.id})
        const backUrl  = `http://localhost:3000/members/${req.params.id}`
        if(req.user) {
            res.render("publicprofile.ejs", {findUser: findUser})
        } else {
            // Kullanıcı giriş yapmadıysa, backUrl'i returnTo olarak ayarla
            req.session.returnTo = backUrl;
            res.redirect("/login");
        }
    } catch (error) {
        
    }

}