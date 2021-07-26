import { auth } from './handlers/authFunc';
import { 
    getMainPage, 
    getRegPage, 
    getVhodPage, 
    getUserPage, 
    postReg, 
    postLogin, 
    getExcursionPage, 
    getExit, 
    getReviewPage, 
    getAddRevPage, 
    postAddRev, 
    postExcursion, 
    getAdminLogin, 
    getAdminPage, 
    postClearOrder, 
    postAdmin,
    getAddExcPage,
    postAddExc,
    postAddOrder,
    getDelExcPage,
    postDelExc
    } from './handlers/handlers';

import bodyParser = require('body-parser');
import session = require('express-session');
import express = require('express');

const app = express();

const urlencodeParser = bodyParser.urlencoded({
    extended: false
});

app.use(session({
    secret: 'dsqsd',
    resave: false,
    saveUninitialized: false
}))

var i18n = require('i18n-abide');
 
app.use(i18n.abide({
  supported_languages: ['en-US', 'de', 'es', 'zh-TW'],
  default_lang: 'en-US',
  translation_directory: 'static/i18n'
}));

app.use('/public', express.static('public'));
app.set('view engine', 'ejs');
app.get('/', getMainPage);
app.get('/registration', getRegPage);
app.get('/vhod', getVhodPage);
app.get('/exit', getExit)
app.get('/user', auth, getUserPage);
app.get('/review', getReviewPage);
app.get('/addreview', getAddRevPage);
app.get('/excursion', getExcursionPage);
app.get('/adminLogin', getAdminLogin);
app.get('/adminPage', getAdminPage)
app.post('/addreview', urlencodeParser, postAddRev);
app.post('/registration', urlencodeParser, postReg);
app.post('/login', urlencodeParser, postLogin);
app.post('/excursion', auth, urlencodeParser, postExcursion);
app.post('/clear_order', urlencodeParser, postClearOrder);
app.post('/admin', urlencodeParser, postAdmin);
app.get('/addExc', getAddExcPage)
app.post('/paddExc', urlencodeParser, postAddExc);
app.post('/addOrder', urlencodeParser, postAddOrder);
app.get('/getdelExc', getDelExcPage);
app.post('/postdelExc', urlencodeParser, postDelExc);

app.listen(3085);