var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//前台路由
var index = require('./routes/index');
var slowlist= require('./routes/slowlist');
var content=require("./routes/content");

//后台路由
//每一个文件去加载自己写的一个模块js 需要通过相对路径去获取
var admin=require("./routes/admin/admin");
var admin_users=require("./routes/admin/users");
var admin_tag=require("./routes/admin/tag");
var admin_article=require("./routes/admin/article");

var app = express();

// view engine setup 加载模板引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//指定静态资源目录
app.use(express.static(path.join(__dirname, 'public')));

//前台路由配置
app.use('/', index);
app.use('/slowlist',slowlist);
app.use("/content",content);

//后台路由配置
app.use("/admin",admin);
app.use("/admin/users",admin_users);
app.use("/admin/tag",admin_tag);
app.use("/admin/article",admin_article);

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

module.exports = app;
