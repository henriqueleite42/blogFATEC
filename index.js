const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'FrontEnd')));

app.engine('html', require('ejs').renderFile)

app.set('views', path.join(__dirname, 'FrontEnd'));
app.set('view engine', 'html');

require('./BackEnd/App/Controller/Posts')(app);
require('./BackEnd/App/Controller/Users')(app);
require('./BackEnd/App/Controller/Categories')(app);
require('./BackEnd/App/Controller/View')(app);

app.listen(8080);