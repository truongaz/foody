const router = require('express').Router();
var r = require('../ctrl/router');
var valid = require('../valid');

router.get('/login', r.getLogin);
router.post('/login', valid.login, r.postLogin);

router.get('/regis', valid.checkLogin, r.getRegis);
router.post('/regis', valid.checkLogin, valid.regis, r.postRegis);

router.get('/profile/:id', valid.checkLogin, r.getProfile);

router.post('/logout', r.postLogout);

module.exports = router;