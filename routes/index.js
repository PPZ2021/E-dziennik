var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {page: 'index'});
});
router.get('/:page(index|technology|projects|education)?', function(req, res, next) {
  res.render('index', {page: req.params.page});
})

module.exports = router;
