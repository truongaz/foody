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
        } else {
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

    static getType(id) {
        var sql =
            `SELECT type from account 
    where id='${id}' `;
        return new Promise(function (reso, rej) {
            conn.query(sql, function (err, data) {
                if (err) return rej(false);
                if (data && data.length)
                    return reso(data[0]);
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
        and pw = '${pw}' 
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

    static getUsernameID(username) {
        let sql = `select id from account where username ='${username}'`;
        return new Promise(function (reso, rej) {
            conn.query(sql, function (err, data) {
                if (err) return rej(false);
                if (data.length)
                    return reso(data[0].id);
                return reso(false);
            });
        });
    }

    static getFromUsername(username) {
        let sql = `select * from account where username='${username}'`;
        return new Promise(function (reso, rej) {
            conn.query(sql, function (err, data) {
                if (err) return rej(err);
                if (data && data.length)
                    return reso(data[0]);
                return reso(false);
            });
        });
    }

    static listUsers() {
        let sql = `select * from account where type='user'`;
        return new Promise(function (reso, rej) {
            conn.query(sql, function (err, data) {
                if (err) return rej(err);
                if (data && data.length)
                    return reso(data);
                return reso(false);
            });
        });
    }

    static deal(id) {
        return new Promise(function (reso, rej) {
            conn.query(`call deal('${id}')`,
                function (err, data) {
                    if (err) return rej(err);
                    if (data && data.length)
                        return reso(data[0]);
                    return reso(false);
                });
        });
    }

    static transferred(id) {
        let sql =
            `select transfer.id, 
            transfer.date, 
            money,
            account.username as name 
              from transfer
                join account 
                on account.id=transfer.user
              where account.id='${id}'`;
        if (!id) {
            sql =
                `select transfer.id, 
            transfer.date, 
            money,
            account.username as name 
              from transfer
                join account 
                on account.id=transfer.user`;
        }
        return new Promise(function (reso, rej) {
            conn.query(sql, function (err, data) {
                if (err) return rej(err);
                if (data && data.length) {
                    return reso(data);
                }
                return reso(false);
            });
        });
    }

    static async writeLog(id, username) {
        if (id !== undefined) {
            await Account.writeNewLog(id, username);
            let q =
                `UPDATE accesslog set count = count+1 
        where user='${id}'`;
            return new Promise(function (reso, rej) {
                conn.query(q, function (err) {
                    if (err) return rej(err);
                    return reso(true);
                });
            });
        } else {
            await Account.writeNewLog(id, username);
            let id = await Account.getUsernameID(username);
            let q =
                `UPDATE accesslog set count = count+1 
      where user='${id}'`;
            return new Promise(function (reso, rej) {
                conn.query(q, function (err) {
                    if (err) return rej(err);
                    return reso(true);
                });
            });
        }
        return false;
    }

    static async writeNewLog(id, username) {
        if (id !== undefined) {
            let q = `INSERT ignore INTO accesslog(user, count) VALUES('${id}', 0)`;
            return new Promise(function (reso, rej) {
                conn.query(q, function (err, data) {
                    if (err) return rej(err);
                    return reso(true);
                });
            });
        } else {
            let id = await Account.getUsernameID(username);
            let q = `INSERT ignore INTO accesslog(user, count) VALUES('${id}', 0)`;
            return new Promise(function (reso, rej) {
                conn.query(q, function (err, data) {
                    if (err) return rej(err);
                    return reso(true);
                });
            });
        }
        return false;
    }

    static async statisticalAccess() {
        let q =
            `select account.id as id, account.username as name, account.type, count, last
      from account join accesslog on account.id=accesslog.user;      `;
        return new Promise(function (reso, rej) {
            conn.query(q, function (err, data) {
                if (err) return rej(err);
                if (data && data.length)
                    return reso(data);
            });
        });
    }

    static async vote(user, product, rate) {
        let q =
            `insert ignore into rate values ('${user}', '${product}', ${rate})`;
        return new Promise(function (reso, rej) {
            conn.query(q, function (err) {
                if (err) return rej(err);
                return reso(true);
            });
        });
    }

    static getProfile(id) {
        let q = `select * from account a join profile p on a.id=p.account
        where account='${id}'`;
        return new Promise(function (reso, rej) {
            conn.query(q, function (err) {
                if (err) return rej(err);
                if (data && data.length)
                    return reso(data[0]);
                return reso(false);
            });
        });
    }

    static getHeath(id) {
        let q = `call getHeath('${id}')`;
        return new Promise(function (reso, rej) {
            conn.query(q, function (err, data) {
                if (err) return rej(err);
                if (data && data.length)
                    return reso(data[0]);
                return reso(false);
            });
        });
    }
}

// Account.transferred('01')
// .then((x)=> console.log(x))
// .catch((e) => console.log(e));

module.exports = Account;