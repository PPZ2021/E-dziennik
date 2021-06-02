var express = require('express');
var router = express.Router();

router.get('/:page', function (req, res, next) {
  var page = req.params.page;
  const sqlite3 = require('sqlite3').verbose();
  let db = new sqlite3.Database('db.sqlite');
  db.get(`SELECT content FROM pages WHERE name == ?`, [page], function (error, row) {
    if (error) {
      console.error(error.message);
      res.send('db error');
      return true;
    }
    res.send({ 'body': row.content });
    ;

    //komentarz
  });
  db.close();

});

module.exports = router;
