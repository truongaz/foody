const conn = require('../conn');
const Product = require('./product');

class Partner {
  constructor(id, name, addr) {
    this.id = id;
    this.name = name;
    this.address = addr;
  }

  static getProducts(company) {
    let q = `select * 
    from company join produce on company.id=produce.company
    join product on produce.product=product.id
    join buy on product.id = buy.product
    where company.id='${company}'`;
    return new Promise(function (reso, rej) {
      conn.query(q, function (err, data) {
        if (err) return rej(err);
        if (data && data.length)
          return reso(data);
        return reso(false);
      });
    });
  }

  static async getTotalBuy(company) {
    let data = await Partner.getProducts(company);
    if(!data) return false;
    let total = data.reduce((sum, val) => {
      return sum + val.count;
    }, 0);
    data.push({total: total});
    return data;
  }
}

module.exports = Partner;