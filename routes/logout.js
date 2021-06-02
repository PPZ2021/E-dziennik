var express = require('express');
var router = express.Router();

/* POST logout page. */
router.get('/', function (req, res, next) {
  req.session.loggedin = false;
  req.session.username = '';
  res.redirect('/index');
});


module.exports = router;
