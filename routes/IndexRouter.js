let express = require('express');
let router = express.Router();
const passport=require("passport");
const {verifyToken }=require('../middlewares/auth')
const { homeContent } = require('../controllers/IndexController');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post("/",verifyToken , homeContent)

module.exports = router;
