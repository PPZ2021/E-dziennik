var express = require('express');
var router = express.Router();
const { UCZEN, NAUCZYCIEL, RODZIC } = require("../roles.json");
const mysql = require("mysql2");
const dataBase = mysql.createConnection({
  host: "51.83.132.115",
  user: "userroot",
  password: "hWYcxoNf33HSYer8kRyt",
  database: "ppz_dziennik"
});

/* POST login page. */
router.post('/', function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  console.log('username ' + username); console.log('password ' + password);

  if (username && password) {
    dataBase.query(`SELECT idUcznia FROM UczenH WHERE loginUcznia = ? AND hashHasła = ?`, [username, password], function (error, idUcznia) {
      if (error) {
        console.error(error.message);
        res.send('db error');
        return true;
      }
      //console.log(idUcznia[0].idUcznia);
      if (idUcznia.length > 0) {
        req.session.loggedin = true;
        req.session.username = username;
        req.session.role = UCZEN;
        req.session.userid = idUcznia[0].idUcznia;
        res.redirect('/uczen');
        //res.end();
        return;
      }else{
        dataBase.query(`SELECT idRodzica FROM RodzicH WHERE loginRodzica = ? AND hashHasła = ?`, [username, password], function (error, idRodzica) {
          if (error) {
            console.error(error.message);
            res.send('db error');
            return true;
          }
          if (idRodzica.length > 0) {
            req.session.loggedin = true;
            req.session.username = username;
            req.session.role = RODZIC;
            req.session.userid = idRodzica;
            res.redirect('/admin');
            //res.end();
            return;
          }
          else{
            dataBase.query(`SELECT 'idNauczyciela' FROM NauczH WHERE 'loginNauczyciela' = '?' AND 'hashHasła' = '?'`, [username, password], function (error, idNauczyciela) {
              if (error) {
                console.error(error.message);
                console.error(error);
                res.send('db error');
                return true;
              }
              if (idNauczyciela.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                req.session.role = NAUCZYCIEL;
                req.session.userid = idNauczyciela;
                res.redirect('/admin');
                //res.end();
                return;
              } else {
                res.send('Incorrect Username and/or Password!');
                res.end();
              }
              console.log(idNauczyciela.length);
            });
          }
        });
      }
    });
  } else {
    res.send('Please enter Username and Password!');
    res.end();
  }
  //db.close();
});


module.exports = router;
