const shortid = require('shortid');
const conn = require('../conn');

class Product {
  constructor(id, name, price, info, type) {
    this.id = id || shortid.generate();
    this.name = name || 'unamed';
    this.price = price || 0;
    this.info = info || 'No info';
    this.type = type || '01';
  }

  static saveProduct(product) {
    let sql =
      `insert into product values (
      '${product.id}',
      '${product.name}',
      ${product.price},
      '${product.info}',
      '${product.type}'
    )`;

    return new Promise((reso, rej) => {
      conn.query(sql, function (err, data) {
        if (err) rej(err);
        reso(true);
      });
    });
  }

  static findProducts(query) {
    let sql =
      `SELECT * From product where name like '%${query}%'`;
    return new Promise(function (reso, rej) {
      conn.query(sql, function (err, data) {
        if (err) rej(false);
        if (data.length)
          return reso(data);
        return reso(false);
      });
    });
  }

  static findProductPrice(min, max) {
    let sql =
      `SELECT * From product where price between ${min} and ${max}`;
    return new Promise(function (reso, rej) {
      conn.query(sql, function (err, data) {
        if (err) rej(false);
        if (data && data.length)
          return reso(data);
        return reso(false);
      });
    });
  }

  static findProductRate(rate) {
    rate = Math.floor(rate);
    let sql =
      `SELECT * 
    FROM product join rate 
    on product.id=rate.product 
    where floor(rate.rate) = ${rate}`;
    return new Promise(function (reso, rej) {
      conn.query(sql, function (err, data) {
        if (err) return rej(err);
        if (data && data.length)
          return reso(data);
        return reso(false);
      });
    });
  }

  static getNutri(id) {
    let sql = `select * from product p join nutrition n
    on p.id=n.product where `;
  }

  static getVote(user, product) {
    let q = `select user, productid, vote
    from vote v join account a on v.user=a.id
    join product p on v.product=p.id
    where user='${user}' and product='${product}'`;

    return new Promise(function (reso, rej) {
      conn.query(q, function (err, data) {
        if (err) return rej(err);
        if (data && data.length) {
          return reso(data);
        }
        return reso(false);
      })
    });
  }

  static getProducts() {
    return new Promise((reso, rej) => {
      conn.query(`select * from product`, (err, data) => {
        if (err) return rej(err);
        return reso(data);
      });
    });
  }

  static getNutri(product) {
    let q = `select * from nutri where product= '${product}'`;
    return new Promise(function (reso, rej) {
      conn.query(q, function (err, data) {
        if (err) return rej(err);
        if (data && data.length) {
          return reso(data[0]);
        }
        return reso(false);
      })
    });
  }
}

module.exports = Product;
// let a = new Product();
// Product.findProducts('te')
// .then((data) => console.log(data));

// Product.saveProduct({ id: "xx", name: "xx", price: 1, info: "i dont know", type: "02" })
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));

// Product.getNutri('01')
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));