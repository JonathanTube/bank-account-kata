const sqlite3 = require('sqlite3').verbose()

// initialize the sqlite database with memory mode.
// const db = new sqlite3.Database(':memory:')
const db = new sqlite3.Database('D:/test.sqlite')

const initDB = () => {
    return new Promise((resolve, reject) => {
        const sql = `create table bank_account (
                            id          INTEGER not null primary key autoincrement,
                            amount      NUMERIC not null,
                            balance     NUMERIC not null,
                            category    TEXT not null,
                            createdAt   TEXT default (datetime('now', 'localtime'))
                        )`

        db.run(sql, (_, err) => {
            if (err) {
                console.error('failed to start the backend server', err.message)
                reject(err)
            }
            resolve(true)
        })
    })
}

module.exports = {
    db,
    initDB
}