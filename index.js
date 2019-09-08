const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./BackEnd/App/Controller/Posts')(app);
require('./BackEnd/App/Controller/Users')(app);
require('./BackEnd/App/Controller/Categories')(app);

app.listen(8080);