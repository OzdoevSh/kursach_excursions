"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var authFunc_1 = require("./handlers/authFunc");
var handlers_1 = require("./handlers/handlers");
var bodyParser = require("body-parser");
var session = require("express-session");
var express = require("express");
var app = express();
var urlencodeParser = bodyParser.urlencoded({
    extended: false
});
app.use(session({
    secret: 'dsqsd',
    resave: false,
    saveUninitialized: false
}));
var i18n = require('i18n-abide');
app.use(i18n.abide({
    supported_languages: ['en-US', 'de', 'es', 'zh-TW'],
    default_lang: 'en-US',
    translation_directory: 'static/i18n'
}));
app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.get('/', handlers_1.getMainPage);
app.get('/registration', handlers_1.getRegPage);
app.get('/vhod', handlers_1.getVhodPage);
app.get('/exit', handlers_1.getExit);
app.get('/user', authFunc_1.auth, handlers_1.getUserPage);
app.get('/review', handlers_1.getReviewPage);
app.get('/addreview', handlers_1.getAddRevPage);
app.get('/excursion', handlers_1.getExcursionPage);
app.get('/adminLogin', handlers_1.getAdminLogin);
app.get('/adminPage', handlers_1.getAdminPage);
app.post('/addreview', urlencodeParser, handlers_1.postAddRev);
app.post('/registration', urlencodeParser, handlers_1.postReg);
app.post('/login', urlencodeParser, handlers_1.postLogin);
app.post('/excursion', authFunc_1.auth, urlencodeParser, handlers_1.postExcursion);
app.post('/clear_order', urlencodeParser, handlers_1.postClearOrder);
app.post('/admin', urlencodeParser, handlers_1.postAdmin);
app.get('/addExc', handlers_1.getAddExcPage);
app.post('/paddExc', urlencodeParser, handlers_1.postAddExc);
app.post('/addOrder', urlencodeParser, handlers_1.postAddOrder);
app.get('/getdelExc', handlers_1.getDelExcPage);
app.post('/postdelExc', urlencodeParser, handlers_1.postDelExc);
app.listen(3085);
