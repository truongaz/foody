const express = require('express');
const app = express();
var port = 3000;
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var cookieParser = require('cookie-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser());
    
var route = require('./route/all');

app.set('views', './pug');
app.set('view engine', 'pug')

app.use(route);

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});