const conn = require('../conn');
const shortid = require('shortid');

class Account {
  constructor(id, username, pw, type) {
    this.id = id;
    this.username = username || '';
    this.pw = pw || '';
    this.type = type || 'user';
  }

  static saveAccount(account) {
    return new Promise(function (reso, rej) {
      let sql =
        `INSERT INTO account (id, username, pw, type) 
        VALUES (
          "${account.id}", 
          "${account.username}", 
          "${account.pw}",
          "${account.type}"
        )`;
      conn.query(sql, (err, data) => {
        if (err) return rej(false);
        else reso(true);
      });
    });
  }

  static saveAccount(account, id) {
    let sql =
      `INSERT INTO account (id, username, pw, type) 
      VALUES (
        "${id}", 
        "${account.username}", 
        "${account.pw}",
        "${account.type}"
      )`;
    return new Promise(function (reso, rej) {
      conn.query(sql, (err, data) => {
        if (err) return rej(false);
        else reso(true);
      });
    });
  }

  static checkID(id) {
    return new Promise(function (reso, rej) {
      var sql = `Select * from account 
      where id='${id}'`;
      conn.query(sql, (err, data) => {
        if (err) throw err;
        if (data.length)
          return reso(true);
        return reso(false);
      });
    });
  }

  static checkUsername(username) {
    return new Promise(function (reso, rej) {
      var sql = `SELECT id from account 
        where username='${username}'`;
      conn.query(sql, function (err, data) {
        if (err) return rej(false);
        if (data.length)
          return reso(true);
        return reso(false);
      });
    });
  }

  // return 0 if faild, account if true
  static getAccount(id, account) {
    if (id) {
      let sql = `Select * From account
      Where id= '${id}'
      `;
      return new Promise(function (reso, rej) {
        conn.query(sql, function (err, data) {
          if (err) return rej(false);
          if (data.length)
            return reso(data[0]);
          return reso(false);
        });
      });
    }
    else {
      let username = account.username;
      let pw = account.pw;
      var sql =
        `SELECT id from account 
        where username='${username}' 
        and pw='${pw}'
        `;
      return new Promise(function (reso, rej) {
        conn.query(sql, function (err, data) {
          if (err) return rej(false);
          if (data.length)
            return reso(data[0].id);
          return reso(false);
        });
      });
    }
  }

  static checkAccount(account) {
    let username = account.username;
    let pw = account.pw;
    var sql =
      `SELECT id from account 
        where username='${username}' 
        and pw='${pw}'
        `;
    return new Promise(function (reso, rej) {
      conn.query(sql, function (err, data) {
        if (err) return rej(false);
        if (data.length)
          return reso(true);
        return reso(false);
      });
    });
  }

  static getID(account) {
    let username = account.username;
    let pw = account.pw;
    var sql =
      `SELECT id from account 
        where username='${username}' 
        `;
    return new Promise(function (reso, rej) {
      conn.query(sql, function (err, data) {
        if (err) return rej(false);
        if (data.length)
          return reso(data[0].id);
        return reso(false);
      });
    });
  }
}

module.exports = Account;