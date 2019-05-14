const router = require('express').Router();
// A route is an Class that include method
//Because of NodeJS, we cann't declare properties
var account = require('./account');
var product = require('./product');
var valid = require('../valid');
var r = require('../ctrl/router');


router.get('/', (req, res, next) => {
  res.render('index');
});

router.use('/account', account);
router.use('/product', product);

router.post('/contact', valid.checkLogin, r.postContact);

router.post('/', valid.checkLogin, valid.checkManager, r.announce)

router.get('/cart', valid.checkLogin, r.getCart);
router.post('/cart', valid.checkLogin, r.addCart);
router.get('/cart/pay', (req, res) => {
  res.send('<h1>Transferred <br> <a href="/cart">Back</a></h1>');
});

// router.get('/cart', valid.checkLogin, r.getCart);
router.post('/cart/update', valid.checkLogin, r.updateQuantity);


module.exports = router;