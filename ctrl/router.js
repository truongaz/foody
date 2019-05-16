const shortid = require('shortid');
const Account = require('./acccount');
const Product = require('./product');
const Manager = require('./manager');
const Cart = require('./cart');
const Vote = require('./vote');
const PayLog = require('./paylog');
const Partner = require('./partner');

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
    } else {
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
    let msg = await Account.getHeath(account.id);
    msg = msg[0];
    if (msg['THIN']) {
        msg = 'Should eat more meat';
    }
    else if (msg['Fat']) {
        msg = 'Should eat less than';
    }
    else msg = 'Perfect ';
    if (account) {
        res.render('account/profile', {
            account: account,
            msg: msg
        });
    } else {
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
    } else if (name) {
        data = await Product.findProducts(name);
    } else if (rate !== false) {
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
        default:
            res.send('Unknow type');
    }
}

module.exports.postLogout = (req, res, next) => {
    res.clearCookie('login');
    res.redirect('/account/login');
}

module.exports.getProduct = async function (req, res, next) {
    let products = await Product.getProducts();
    let user = await Account.getUsernameID(req.cookies.login);
    for (x of products) {
        x.rate = await Vote.getVote(user, x.id);
        x.rate = x.rate.rate;
        x.nutri = await Product.getNutri(x.id);
    }
    res.render('product/index', {
        products: products
    });
    next();
}

module.exports.getTransfers = async function (req, res, next) {
    let id = await Account.getUsernameID(req.cookies.login);
    let type = await Account.getType(id);
    type = type.type;
    let total = 0;
    let data;
    if (type == 'admin') {
        data = await Account.transferred();
    } else
        data = await Account.transferred(id);
    total = data.reduce(function (x, val) {
        return val.money + x;
    }, 0);
    res.render('account/profile', {
        transfers: data,
        totalcost: total
    })
}

module.exports.deal = async function (req, res, next) {
    let id = await Account.getUsernameID(req.cookies.login);
    let data = await Account.deal(id);
    res.render('account/profile', {
        transfers: data
    });
}

module.exports.postDeal = async function (req, res, next) {
    let id = await Account.getUsernameID(req.cookies.login);
    let clearTransfer;
    req.body.clearTransfer ? clearTransfer = req.body.clearTransfer : clearTransfer = undefined;
    if (clearTransfer) {
        await PayLog.clearLog(clearTransfer);
    }
    res.redirect('/account/transfer');
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
        } else {
            status.push('An error has occurred.');
            res.render('account/manage', {
                fail: status
            });
        }
        status = [];
    } else {
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

function sum(data) {
    let sum = 0;
    for (x in data) {
        sum += data[x].price * data[x].quantity;
    }
    return sum;
}

module.exports.getCart = async function (req, res, next) {
    let id = await Account.getUsernameID(req.cookies.login);
    let sql =
        `select * from cart where user= '${id}'`;
    let data = await Cart.getCart(req.cookies.login);
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
    quantity ? quantity : quantity = 1;
    let vote;
    req.body.vote ? vote = Number(req.body.vote) : vote = undefined;
    if (quantity) {
        let check = await Cart.saveCart(user, product, price, quantity);
        if (check === false) {
            res.send('Has a error');
        } else {
            res.redirect('/cart');
        }
    }
    if (vote) {
        let result = await Vote.vote(user, product, vote);
        if (result !== true) res.send('An erros has occurred.')
        res.redirect('/product');
    }
}

module.exports.updateQuantity = async function (req, res, next) {
    let user = await Account.getUsernameID(req.cookies.login);
    let product = req.body.product;
    let price = req.body.price;
    let check;
    if (req.body.decrease && req.body.decrease !== 0) {
        check = await Cart.decreaseQuantity(user, product, req.body.decrease);
        if (check === false) {
            res.send('Has a error');
        } else {
            res.redirect('/cart');
        }
    }
    if (req.body.increase && req.body.increase !== 0) {
        check = await Cart.increaseQuantity(user, product, price, req.body.increase);
        if (check === false) {
            res.send('Has a error');
        } else {
            res.redirect('/cart');
        }
    }
}

module.exports.addMenu = async function (req, res, next) {
    let user = await Account.getUsernameID(req.cookies.login);
    await Product.makeMenu(user, req.body.joinproduct);
    res.redirect('/account/menu');
}

module.exports.getMenu = async function (req, res, next) {
    let user = await Account.getUsernameID(req.cookies.login);
    let data = await Product.getMenu(user);
    let nutri = {
        carb: 0,
        fat: 0,
        protein: 0,
        calo: 0
    }

    data.map((x) => {
        for (y in x)
            if (y in nutri) {
                nutri[y] += x[y];
            }
    });

    let msg = [];
    for (key in nutri) {
        console.log(key, nutri[key])
        if (nutri[key] < 1 && key != 'calo')
            msg.push('Should add ' + key);
    }


    // msg = msg.reduce((val, idx) {
    //     if (nutri[val] < max) {
    //         return new String('Should add more ' + val);
    //     }
    // });
    res.render('account/menu', {
        data: data,
        msg: msg,
        info: nutri
    });
}

module.exports.getPartner = async (req, res, next) => {
    let partner = await Account.getUsernameID(req.cookies.login);
    let data = await Partner.getTotalBuy(partner);
    if (data == false) {
        res.render('partner/index');
        return;
    }
    let total = data.pop();
    res.render('partner/index', {
        data: data,
        total: total.total
    });
}