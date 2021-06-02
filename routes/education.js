var express = require('express');
var router = express.Router();

/* GET education page. */
router.get('/', function(req, res, next) {
  res.render('education');
});


module.exports = router;
