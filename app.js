/**
 * 담당자 : 강재민, 김건희
 * 파일 설명 : 서버 실행을 위한 파일입니다.
 * */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'frontend/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'frontend/public')));

// env 설정
const dotenv = require('dotenv');
dotenv.config();

// 세션 설정
const configSession = require('./backend/config/session');
configSession(app);

// passport 설정
const configPassport = require('./backend/config/passport');
configPassport(app);

// DB 연결
const database = require('./backend/config/database');
database();

// Router 연결
const dashboardRouter = require('./backend/routes/dashboard');
const loginRouter = require('./backend/routes/login');
const scheduleRouter = require('./backend/routes/schedule');
const layoutRouter = require('./backend/routes/layout');
const calendarRouter = require('./backend/routes/calendar');
const tagStatisticsRouter = require('./backend/routes/tagStatistics');
const feedRouter = require('./backend/routes/feed');
const todoListRouter = require('./backend/routes/todoList')

app.use('/', dashboardRouter);
app.use('/login', loginRouter);
app.use('/schedule', scheduleRouter);
app.use('/layout',layoutRouter);
app.use('/calendar',calendarRouter);
app.use('/tagStatistics', tagStatisticsRouter);
app.use('/feed', feedRouter);
app.use('/todoList',todoListRouter);

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

module.exports = app;
