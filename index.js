const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./BackEnd/App/Controller/UserController")(app);
require("./BackEnd/App/Controller/Posts")(app);

app.listen(8080);