
const { initDB, db } = require('./utils/sqlite.util.js')
const app = require('./app')
const _ = require('lodash')
const moment = require('moment')

// initialize the sqlite database with memory mode.
initDB().then(res => {
    app.listen(3000)
    // insert 100 rows into the database(deposit)
    db.serialize(() => {
        let total = 0
        for (let i = 0; i < 12; i++) {
            let amount = Math.round(Math.random() * 100)
            total += amount
            const createdAt = getRandomDateBeforeNow()
            db.run('INSERT INTO bank_account(amount, balance, category,createdAt) VALUES (?, ?, ?, ?)', [amount, total, 'deposit', createdAt])
        }
    })
}).catch((err) => {
    console.error('failed to start the backend server', err.message)
    process.exit(1)
})

const getRandomDateBeforeNow = () => {
    const startDate = new Date().setMinutes(_.random(0, 59) * -1)
    const endDate = new Date()
    const timestamp = _.random(startDate, endDate.getTime())
    const createdAt = moment(new Date(timestamp)).format('YYYY-MM-DD HH:mm:ss')
    return createdAt
}