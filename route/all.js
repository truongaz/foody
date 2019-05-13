const router = require('express').Router();
// A route is an Class that include method
//Because of NodeJS, we cann't declare properties
var account = require('./account');
var product = require('./product');
var valid = require('../valid');
var r = require('../ctrl/router');


router.get('/', (req, res, next) => res.render('index'));
router.use('/account', account);
router.use('/product', product);

router.post('/contact', valid.checkLogin, r.postContact);

module.exports = router;