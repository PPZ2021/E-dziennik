var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');


var loginRouter = require('./routes/login');
var authRouter = require('./routes/auth');
var uczenRouter = require('./routes/uczen');
var rodzicRouter = require('./routes/rodzic');
var nauczycielRouter = require('./routes/nauczyciel');
var logoutRouter = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());


app.use(logger('dev'));
//app.use(express.json());
//app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', loginRouter);
app.use('/login', loginRouter)
app.use('/auth', authRouter)
app.use('/uczen', uczenRouter)
app.use('/rodzic', rodzicRouter)
app.use('/nauczyciel', nauczycielRouter)
app.use('/logout', logoutRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


/*app.get('/', function(req, res) {
  res.send('Hello World!');
});
app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
*/

module.exports = app;
