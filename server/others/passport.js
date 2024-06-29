const JwtStrategy = require("passport-jwt").Strategy
const ExtractJwt = require("passport-jwt").ExtractJwt
const User = require("../models").userModel

module.exports = (passport)=>{
    let opts = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        secretOrKey: process.env.PASSPORT_SECRET
    }
    passport.use(
        new JwtStrategy(opts, function(jwt_payload, done){
            User.findOne({_id: jwt_payload._id})
                .then((user)=>{
                    if(user){
                        done(null, user)
                    }
                    else{
                        done(null, false)
                    }
                })
                .catch(
                    (err) =>done(err, user)
                )
        })
    )   

}