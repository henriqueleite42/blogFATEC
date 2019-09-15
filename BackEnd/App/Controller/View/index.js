const express = require('express');
const router = express.Router();

router.use('/', (req, res) => {
    res.render('index.html');
});


module.exports = app => app.use('/', router);