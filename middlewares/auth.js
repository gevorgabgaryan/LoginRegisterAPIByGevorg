const passport = require('passport');
const jwt=require("jsonwebtoken")


require("dotenv").config()
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

verifyToken = (req, res, next) => {
   try{ 
    let tokenBarear = req.headers["authorization"] ;
    let token=tokenBarear.split(" ")[1]
  
    if (!token) {
      return res.json({ error: "No token provided!" });
    }
  
    jwt.verify(token,process.env.jwtAccessSecret , (err, decoded) => {
 
      if (err) {
      
        return res.json({ error: err.message });
      }

      req.user=decoded;
      next();
     });
    }catch(err){
        return res.json({ error:err.message})
    }
    
  };


 passport.use(new GoogleStrategy({
  clientID:`${process.env.clientIdGoogle}`,
  clientSecret:`${process.env.clientSecretGoogle}`,
  callbackURL: `${process.env.host}auth/google/callback`,
  passReqToCallback   : true
},
  function(request, accessToken, refreshToken, profile, done) {    
      return done(null, profile);
  }
)); 

passport.use(new FacebookStrategy({
    clientID: `${process.env.clientIdFacebook}`,
    clientSecret: `${process.env.clientSecretFacebook}`,
    callbackURL: `${process.env.host}facebook/callback`,
    profileFields: ['id', 'emails', 'name'] 
  },
  function(accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));


module.exports = {
  initialize: passport.initialize(),
  verifyToken
}


