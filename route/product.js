const router = require('express').Router();
var r = require('../ctrl/router');

router.get('/', r.getProduct);

router.get('/find', r.findProduct);
module.exports = router;