var Account = require('./acccount');
var conn = require('../conn');

class Cart {
  constructor(user, product, price, quantity) {
    this.user = user || '';
    this.product = product || '';
    this.price = price || '';
    this.quantity = quantity || '';
  }

  static saveCart(user, product, price, quantity) {
    let q =
      `call increaseQuantity('${user}', '${product}', ${price}, ${quantity})`;
    return new Promise(function (reso, rej) {
      conn.query(q, function (err) {
        if (err) rej(err);
        return reso(true);
      });
    });
  }

  static increaseQuantity(user, product, price, count) {
    let q =
      `call increaseQuantity('${user}', '${product}', ${price}, ${count})`;
    return new Promise(function (reso, rej) {
      conn.query(q, function (err) {
        if (err) rej(err);
        return reso(true);
      });
    });
  }

  static decreaseQuantity(user, product, count) {
    let q =
      `call decreaseQuantity('${user}', '${product}', ${count})`;
    return new Promise(function (reso, rej) {
      conn.query(q, function (err) {
        if (err) rej(err);
        return reso(true);
      });
    });
  }

  static getCart(username) {
    let q =
      `select * from cart c join product p
    on c.product=p.id
    join account a
    on c.user=a.id`;

    return new Promise(function (reso, rej) {
      conn.query(q, function (err, data) {
        if (err) rej(err);
        if (data && data.length)
          return reso(data);
        return reso(false);
      });
    });
  }
}

module.exports = Cart;