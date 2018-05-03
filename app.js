var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require("express-session")({
	secret: 'keyboard cat',
  	cookie: {maxAge:60*10*60 }
})
var iosession=require("express-socket.io-session")(session)

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server=require('http').Server(app)
server.listen(8080)
var io=require('socket.io')(server)
io.use(iosession);
io.on("connection",socket=>{
	socket.on("req",(data,cb)=>{
		console.log(data);
		cb("我是返回的数据");
	})
	socket.on("say",data=>{
		const num=++socket.handshake.session.num;
		socket.handshake.session.save();
		/*socket.emit("answer",data+"("+new Date()+")");//每次打开都是一个新的会话*/
		/*io.emit("answer",data+"("+new Date()+")")*///整个是一个会话   
		io.emit("answer","num="+num);
	})
})
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session)
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);	
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

/*module.exports = app;*/
