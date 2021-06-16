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
      dataBase.query(`SELECT * FROM Oceny WHERE idUcznia = ?`, [req.session.userid], function (error, rowsO) {
        if (error) {
          console.error(error.message);
          console.error(error);
          res.send('db error');
          return true;
        }
        var listaOcen = new Map();
        for(var i = 0; i < rowsO.length; i++){
          var r = rowsO[i];
          var rec = listaOcen.get(r['nazwaPrzedmiotu']);
          if(!rec) rec = new Array();
          rec.push(r['ocena']);
          listaOcen.set(r['nazwaPrzedmiotu'], rec);  
        }
        var srednie = new Map();
        listaOcen.forEach(function(value, key){
          console.log(value);
          console.log(key);
          var sum = 0;
          value.forEach(function(val){sum+=val});
          srednie.set(key, sum/value.length);
        });
        var sredniaRoczna = 0;
        srednie.forEach(function(value, key){
          console.log(value);
          sredniaRoczna+=value;
        });
        if(sredniaRoczna > 0){
          sredniaRoczna = sredniaRoczna/srednie.size;
        }
        console.log(srednie);
        console.log(sredniaRoczna);
        res.render('uczen', { username: req.session.username,user:rows[0], oceny: listaOcen, srednie: srednie, sredniaRoczna: sredniaRoczna });
      });
    });
    //db.close();
    
  } else {
    res.send('Please login to view this page!');
  }

  //res.end();
});

module.exports = router;
