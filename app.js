var express = require('express');
var session = require("express-session")
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var piano = require('./routes/Browser_Piano')
var insert_file_path = require("./routes/insert")
var select_file_path = require("./routes/select")
var list_recordings_file_path = require("./routes/list_recordings")

var app = express();
let secret_string = "ssshhhhh"
// view engine setup
app.set('views', path.join(__dirname, 'views'));

//http://tastytuts.net/nodejs-tutorials/use-html-express-instead-jade-node-js/

//default with express is jade, need to switch to html
//app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//https://codeforgeek.com/2014/09/manage-session-using-node-js-express-4/
//for managing sessions
app.use(session({secret: secret_string}));

//tell app to use this folder to find public static files
//aka, tell it this is where to get the css and js files
app.use(express.static(path.join(__dirname, 'public')));

//tell app what js file should handle specific requests
app.use('/', index);
app.use('/Browser_Piano', piano)
app.use('/insert', insert_file_path)
app.use('/select', select_file_path)
app.use("/list_recordings", list_recordings_file_path)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}//end of anonymous function
);//end of use function

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
