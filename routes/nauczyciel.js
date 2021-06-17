var express = require('express');
var router = express.Router();
const { NAUCZYCIEL } = require("../roles.json");
const mysql = require("mysql2");
const dataBase = mysql.createConnection({
  host: "51.83.132.115",
  user: "userroot",
  password: "hWYcxoNf33HSYer8kRyt",
  database: "ppz_dziennik"
});

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.session.loggedin && req.session.role == NAUCZYCIEL) {
    console.log(req.session.userid);
    dataBase.query(`SELECT * FROM Nauczyciel WHERE idNauczyciela = ?`, [req.session.userid], function (error, rows) {
      if (error) {
        console.error(error.message);
        console.error(error);
        res.send('db error');
        return true;
      }

      dataBase.query(`SELECT * FROM Przedmiot LEFT JOIN Oceny using(nazwaPrzedmiotu) WHERE idNauczyciela = ?`, [req.session.userid], function (error, rowsO) {
        if (error) {
          console.error(error.message);
          console.error(error);
          res.send('db error');
          return true;
        }
        //console.log('rowO: ' + JSON.stringify(rowsO));

        var subject = new Map()
        for (var i = 0; i < rowsO.length; i++) {
          var arrN = rowsO[i];
          subject.set(arrN.nazwaPrzedmiotu, true);
        }
        console.log('subject: ' + JSON.stringify(subject));

        let pages = [];
        console.log(rows[0]);
        res.render('nauczyciel', { username: req.session.username, pagesList: pages, user: rows[0], score: rowsO, sub: subject });
      });
    });
    //db.close();

  } else {
    res.send('Please login to view this page!');
  }

  //res.end();
});

router.get('/przedmiot/:subject', function (req, res, next) {
  if (req.session.loggedin && req.session.role == NAUCZYCIEL) {
    dataBase.query(`SELECT DISTINCT(Oceny.nazwaKlasy) FROM Przedmiot JOIN Oceny using(nazwaPrzedmiotu) WHERE idNauczyciela = ? AND nazwaPrzedmiotu = ?;`, [req.session.userid, req.params.subject], function (error, rows) {
      if (error) {
        console.error(error.message);
        console.error(error);
        res.send('db error');
        return true;
      }
      //console.log("class: " + JSON.stringify(rows))

      res.send({ classes: rows });
    })
  } else {
    res.send('Please login to view this page!');
  }
});

router.get('/przedmiot/:subject/klasa/:class_', function (req, res, next) {
  if (req.session.loggedin && req.session.role == NAUCZYCIEL) {

    dataBase.query(`SELECT idUcznia, imieUcznia, nazwiskoUcznia FROM Uczen JOIN Przedmiot USING(nazwaKlasy) WHERE (idNauczyciela = ? AND nazwaPrzedmiotu = ? AND nazwaKlasy = ?) ORDER BY(nazwiskoUcznia);`, [req.session.userid, req.params.subject, req.params.class_], function (error, rows) {
      if (error) {
        console.error(error.message);
        console.error(error);
        res.send('db error');
        return true;
      }

      var keys = new Array(rows.length);
      var values = new Array(rows.length);

      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        keys[i] = row.idUcznia;
        values[i] = "" + row.nazwiskoUcznia + ' ' + row.imieUcznia;
      }

      res.send({ ke: keys, va: values });
    })
  } else {
    res.send('Please login to view this page!');
  }
});


router.post('/ocena', function (req, res, next) {
  if (req.session.loggedin && req.session.role == NAUCZYCIEL) {
    var body = req.body;
    console.log(body)
    if (!body.subject || !body.classes || !body.name || !body.criteria || !body.score) {
      res.send('Incorrect values!');
      return;
    }
    /*
    dataBase.query(`SELECT ocena FROM Oceny WHERE (nazwaKlasy = ? AND nazwaPrzedmiotu = ? AND idUcznia = ?  AND kryterium = ?);`, [body.classes, body.subject, body.name, body.criteria], function (error, rows) {
      if (error) {
        console.error(error.message);
        console.error(error);
        res.send('db error');
        return true;
      }
      console.log(rows);
      if (rows) {
        res.send('Value already exist!');
        return;
      }
    });
    */

    dataBase.query(`INSERT INTO Oceny (nazwaKlasy, nazwaPrzedmiotu, idUcznia, kryterium, ocena) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ocena = ?;`, [body.classes, body.subject, body.name, body.criteria, body.score, body.score], function (error, rowsO) {
      if (error) {
        console.error(error.message);
        console.error(error);
        res.send('db error');
        return true;
      }
    });

    res.redirect(`/nauczyciel`)
    //res.render('edit', { pagename: req.params.page });
  } else {
    res.send('Please login to view this page!');
  }
});

module.exports = router;