const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./BackEnd/App/Controller/Categories")(app);
require("./BackEnd/App/Controller/Posts")(app);
require("./BackEnd/App/Controller/Users")(app);

app.listen(8080);