var express = require('express');
var router = express.Router();

/* POST login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

module.exports = router;
