const md5 = require('md5');
var Account = require('./ctrl/acccount');

function escapeHtml(unsafe) {
  return unsafe
    .trim()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
    .replace(/\\(.)/mg, "$1");
}

module.exports.regis = function (req, res, next) {
  data = req.body;
  err = [];
  if (!data) {
    err.push("Please enter data");
    res.render('account/regis', {
      err: err
    });
  }
  else {
    if (!data.username) {
      err.push("Please enter User name!");
    }
    if (!data.pw) {
      err.push("Please enter password!")
    }
    if (data.pw != data.pw1) {
      err.push("Incorect password retype!");
    }
  }
  if (err.length) {
    res.render('account/regis', {
      err: err
    });
  }
  data.pw = md5(escapeHtml(data.pw));
  res.locals.username = escapeHtml(data.username);
  res.locals.pw = data.pw;
  next();
}


module.exports.login = function (req, res, next) {
  let data = req.body;
  let err = [];
  if (!data) {
    err.push("Please enter data");
    res.render('account/regis', {
      err: err
    });
    err = null;
  }
  else {
    if (!data.username) {
      err.push("Please enter User name!");
    }
    if (!data.pw) {
      err.push("Please enter password!")
    }
    if (err.length) {
      res.render('account/login', {
        err: err
      });
      err = null;
    }
  }
  data.pw = md5(escapeHtml(data.pw));
  res.locals.username = escapeHtml(data.username);
  res.locals.pw = data.pw;
  next();
}

module.exports.checkLogin = function (req, res, next) {
  if(!req.cookies || !req.cookies.login) {
    res.redirect('/account/login');
  }
  if(req.cookies.login) {
    next();
  }
}

module.exports.checkManager = async function (req, res, next) {
  let account = await Account.getFromUsername(req.cookies.login);
  if(account.type != 'admin') {
    let err = ['Permission denied.'];
    res.render('account/profile', {
      err: err
    });
    err = [];
  }
  else {
    next();
  }
}