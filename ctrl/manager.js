var Account = require('./acccount');
var conn = require('../conn');

class Manager {
  constructor() {

  }

  static async deleteIDAccount(id) {
    let account = await Account.getAccount(id);
    if (!account)
      res.redirect('/account/manage');
    if (account.type == 'user') {
      let sql =
        `delete from account
        where id='${id}'`;
      return new Promise(function (reso, rej) {
        conn.query(sql, function (err, data) {
          if (err) return rej(err);
          return reso(true);
        });
      });
    }
    else {
      res.send('Permission denied.');
    }
  }

}

module.exports = Manager;