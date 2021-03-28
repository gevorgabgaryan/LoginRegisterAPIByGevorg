const express = require('express');
const fetch = require('node-fetch');
const passport=require("passport");
const { registerNewUser,  verifyUserGet, verifyUserPost, loginUser, resetPassword, setNewPassword, loginWithAPI } = require('../controllers/AuthController');
const { refreshToken, deleteAccount, logOut, deleteView } = require('../controllers/TokenController');
const {checkEmailUnique } = require('../middlewares/checkEmailUnique');
const { validateRegister,  validateLogin } = require('../middlewares/validate');

var router = express.Router();

/* Post register user route*/
router.post('/register', validateRegister, checkEmailUnique, registerNewUser);

/* Post login user route*/
router.post("/login",validateLogin,loginUser)

/* Post logOut user route*/
router.post("/logout",logOut)

/* Post user password route*/
router.post('/reset', resetPassword);

/* Put reset password route*/
router.put('/reset', setNewPassword);

/* GET email verify route for link*/
router.get('/verify/:id/:code',verifyUserGet);
/* POST email verify route */
router.post('/verify/',verifyUserPost);

/* POST refresh token route*/
router.post('/token/',refreshToken);

/* login with Google*/
router.get('/google', passport.authenticate('google', { 
      session:false,
      scope:[ 'email', 'profile' ]
    }),

);


router.get( '/google/callback',
    passport.authenticate( 'google', { session:false }), loginWithAPI);

/* login with Facebook*/
router.get('/facebook', passport.authenticate('facebook',{ scope : ['email'] }));

/* callback for Facebook Login*/
router.get('/facebook/callback',
  passport.authenticate('facebook',{ session:false }),(req,res,next)=>{
         next()
  }, loginWithAPI);

  /* GET delete user*/
  router.get("/delete",deleteView)

  /* POST delete user*/
  router.post("/delete",verifyToken,deleteAccount)



module.exports = router;
