const conn = require('../conn');

class Vote {
  constructor (user, product, vote) {
    this.user = user;
    this.product = product;
    this.vote = vote;
  }

  static vote(user, product, vote) {
    let q = `call vote('${user}', '${product}', ${vote})`;
    return new Promise(function (reso, rej) {
      conn.query(q, function(err) {
        if (err) return rej(err);
        return reso(true);
      })
    });
  }

  static getVote(user, product) {
    let q = `select rate
    from rate v join account a on v.usr=a.id
    join product p on v.product=p.id
    where usr='${user}' and product='${product}'`;

    return new Promise(function (reso, rej) {
      conn.query(q, function(err, data) {
        if (err) return rej(err);
        if(data && data.length) {
          return reso(data[0]);
        }
        return reso(false);
      })
    });
  }
}

module.exports = Vote;