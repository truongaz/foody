var conn = require('../conn');

class PayLog {
    constructor(user, money, date) {
        this.user = user;
        this.money = money;
        this.date = date;
    }

    static clearLog(transfer) {
        let q = `delete from transfer where id=${transfer}`;
        return new Promise(function (reso, rej) {
            conn.query(q, function (err, data) {
                if (err) return rej(err);
                return reso(true);
            });
        });
    }
}

module.exports = PayLog;