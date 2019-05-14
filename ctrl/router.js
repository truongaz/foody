const router = require('express').Router();
const shortid = require('shortid');
const Account = require('./acccount');
const Product = require('./product');
const Manager = require('./manager');
const Cart = require('./cart');

module.exports.getRegis = function (req, res, next) {
  res.render('account/regis');
  next();
}

module.exports.postRegis = async function (req, res, next) {
  let account;
  account = new Account(shortid.generate(), req.body.username, req.body.pw);
  let check = await Account.checkUsername(account.username);
  if (check !== false) {
    err.push('Username is existed!');
    res.render('account/regis', {
      err: err
    });
    err = [];
  }
  if (check === false) {
    let save = await Account.saveAccount(account, account.id);
    if (!save) {
      err = ['An error has occurred'];
      res.render('account/regis', {
        err: err
      })
      err = [];
    }
    Account.writeNewLog(account.id);
    res.redirect(`/account/login`);
    next();
  }
}

module.exports.getLogin = function (req, res, next) {
  res.render('account/login');
  next();
}

module.exports.postLogin = async function (req, res, next) {
  let account = {
    username: req.body.username,
    pw: req.body.pw
  };
  let err = [];
  account.id = await Account.getID(account);
  if (account.id === false) {
    err.push('Incorrect Account!');
    res.render('account/login', {
      err: err
    });
    err = [];
  }
  else {
    let result = await Account.writeLog(account.id);

    res.cookie('login', account.username);
    res.redirect(`/account/profile/${account.id}`);
  }
}

module.exports.getProfile = async function (req, res, next) {
  let account = {
    id: req.params.id
  }
  account = await Account.getAccount(account.id);
  if (account) {
    res.render('account/profile', {
      account: account
    });
  }
  else {
    res.send('Account Profile is not avaiable.');
  }
}

module.exports.findProduct = async function (req, res, next) {
  let name = req.query.name || undefined;
  let min = req.query.min ? Number(req.query.min) : false;
  let max = req.query.max ? Number(req.query.max) : false;
  let rate = req.query.rate ? Number(req.query.rate) : false;

  let data;
  if ((min != false || max != false) && (min != 0 || max != 0)) {
    data = await Product.findProductPrice(min, max);
  }
  else if (name) {
    data = await Product.findProducts(name);
  }
  else if (rate !== false) {
    data = await Product.findProductRate(rate);
  }

  res.render('product/index', {
    products: data
  });
  next();
}

module.exports.postContact = function (req, res, next) {
  let typeContact = req.body.type;
  switch (typeContact) {
    case ('numberphone'):
      res.send('Calling to +84.xxx.xxx.xxxx');
      break;
    case ('email'):
      res.send('Mail to <p style= "color: blue; cursor: pointer;">mail@exam.com</p>');
      break;
    case ('fax'):
      res.send('Fax: xxxx');
      break;
    case ('address'):
      res.send('Vietnam');
      break;
    default: res.send('Unknow type');
  }
}

module.exports.postLogout = (req, res, next) => {
  res.clearCookie('login');
  res.redirect('/account/login');
}

module.exports.getProduct = function (req, res, next) {
  res.render('product/index');
  next();
}

module.exports.getTransfers = async function (req, res, next) {
  let id = await Account.getUsernameID(req.cookies.login);
  let data = await Account.transferred(id);
  res.render('account/profile', {
    transfers: data
  })
}

module.exports.getManage = async function (req, res, next) {
  let data = await Account.listUsers();
  res.render('account/manage', {
    accounts: data
  });
}


module.exports.postDeleteUser = async function (req, res, next) {
  let id = req.body.id;
  let status = [];
  if (id) {
    let result = await Manager.deleteIDAccount(id);
    if (result) {
      status.push('Success');
      res.render('account/manage', {
        success: status
      });
    }
    else {
      status.push('An error has occurred.');
      res.render('account/manage', {
        fail: status
      });
    }
    status = [];
  }
  else {
    res.redirect('/account/manage');
  }
}

module.exports.getStatistic = async function (req, res, next) {
  let data = await Account.statisticalAccess();
  res.render('account/statis', {
    accounts: data
  });
}

// limitTime: yyyy-mm-dd 0h0m
module.exports.announce = function (req, res, next) {
  let msg = req.body.msg;
  res.render('index', {
    msg: msg,
  });
}

//
module.exports.voteProduct = function (req, res, next) {

}

function sum(data) {
  let sum=0;
  for (x in data) {
    sum += data[x].price * data[x].quantity;
  }
  return sum;
}

module.exports.getCart = async function (req, res, next) {
  let id = await Account.getUsernameID(req.cookies.login);
  let sql =
    `select * from cart where user= '${id}'`;
  let data = await Cart.getCart(req.cookies.username);
  for (x in data) {
    data[x].cost = 0;
    data[x].cost += data[x].price * data[x].quantity;
  }
  total = sum(data);
  res.render('cart', {
    data: data,
    total: total
  });
}

module.exports.addCart = async function (req, res, next) {
  let user = await Account.getUsernameID(req.cookies.login);
  let product = req.body.product;
  let price = req.body.price;
  let quantity = req.body.quantity;

  let check = await Cart.saveCart(user, product, price, quantity);
  if (check === false) {
    res.send('Has a error');
  }
  else {
    res.redirect('/cart');
  }
}

module.exports.updateQuantity = async function (req, res, next) {
  let user = await Account.getUsernameID(req.cookies.login);
  let product = req.body.product;
  let price = req.body.price;
  let check;
  if (req.body.decrease &&  req.body.decrease !== 0) {
    check = await Cart.decreaseQuantity(user, product, req.body.decrease);
    if (check === false) {
      res.send('Has a error');
    }
    else {
      res.redirect('/cart');
    }
  }
  if (req.body.increase && req.body.increase!== 0) {
    check = await Cart.increaseQuantity(user, product, price, req.body.increase);
    if (check === false) {
      res.send('Has a error');
    }
    else {
      res.redirect('/cart');
    }
  }
}

module.exports.nutritionStatistic = function (req, res, next) {
  
}