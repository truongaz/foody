const router = require('express').Router();
var r = require('../ctrl/router');
var valid = require('../valid');

router.get('/login', r.getLogin);
router.post('/login', valid.login, r.postLogin);

router.get('/regis', r.getRegis);
router.post('/regis', valid.regis, r.postRegis);

router.get('/profile/:id', valid.checkLogin, r.getProfile);

router.get('/transfer', r.getTransfers);

router.post('/logout', r.postLogout);

router.get('/manage', valid.checkLogin, valid.checkManager,  r.getManage);

router.post('/manage', r.postDeleteUser);

router.get('/manage/statistic', r.getStatistic);

router.get('/menu', valid.checkLogin, r.getMenu);
router.post('/menu', r.addMenu);
module.exports = router;