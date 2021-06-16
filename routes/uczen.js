var express = require('express');
var router = express.Router();
const {UCZEN} = require("../roles.json");
const mysql = require ("mysql2");
const dataBase = mysql.createConnection({
    host: "51.83.132.115",
    user: "userroot",
    password: "hWYcxoNf33HSYer8kRyt",
    database: "ppz_dziennik"
});

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loggedin && req.session.role == UCZEN) {
    console.log(req.session.userid);
    dataBase.query(`SELECT * FROM Uczen WHERE idUcznia = ?`, [req.session.userid], function (error, rows) {
      if (error) {
        console.error(error.message);
        console.error(error);
        res.send('db error');
        return true;
      }
      
      console.log('row: ' + JSON.stringify(rows[0]));
      dataBase.query(`SELECT * FROM Uczen LEFT JOIN Oceny USING (idUcznia) WHERE idUcznia = ?`, [req.session.userid], function (error, rows) {
        
      });
      res.render('uczen', { username: req.session.username,user:rows[0] });
    });
    //db.close();
    
  } else {
    res.send('Please login to view this page!');
  }

  //res.end();
});

module.exports = router;
