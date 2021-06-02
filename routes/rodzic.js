var express = require('express');
var router = express.Router();
const {RODZIC} = require("../roles.json");
const mysql = require ("mysql2");
const dataBase = mysql.createConnection({
    host: "51.83.132.115",
    user: "userroot",
    password: "hWYcxoNf33HSYer8kRyt",
    database: "ppz_dziennik"
});

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loggedin && req.session.role == RODZIC) {
    console.log(req.session.userid);
    //dataBase.query(`SELECT * FROM Rodzic WHERE idRodzica = ?`, [req.session.userid], function (error, rows) {
    dataBase.query(`SELECT * FROM  (Rodzic inner join Uczen on Rodzic.Uczen_idUcznia=Uczen.idUcznia)  where idRodzica = ?`, [req.session.userid], function (error, rows) {
      if (error) {
        console.error(error.message);
        console.error(error);
        res.send('db error');
        return true;
      }
      let pages = [];
      console.log(rows[0]);
      res.render('rodzic', { username: req.session.username, pagesList: pages,user:rows[0] });
    });
    //db.close();

  } else {
    res.send('Please login to view this page!');
  }

  //res.end();
});

router.get('/edit/:page', function (req, res, next) {
  if (req.session.loggedin) {
    res.render('edit', { pagename: req.params.page });
  } else {
    res.send('Please login to view this page!');
  }
});

router.post('/edit/:page', function (req, res, next) {
  if (req.session.loggedin) {
    let page = req.params.page;
    console.log(req)
    const sqlite3 = require('sqlite3').verbose();
    let db = new sqlite3.Database('db.sqlite');
    db.run(`UPDATE pages SET content = ? WHERE name == ? `, [req.body.myDoc, page], function (error, row) {
      if (error) {
        console.error(error.message);
        res.send('db error');
        return true;
      }
    });
    db.close();

    res.redirect(`/admin/edit/${page}`)
    //res.render('edit', { pagename: req.params.page });
  } else {
    res.send('Please login to view this page!');
  }
});

module.exports = router;