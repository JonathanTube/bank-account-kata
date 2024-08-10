
const { initDB } = require('./utils/sqlite.util.js')
const app = require('./app')

// initialize the sqlite database with memory mode.
initDB().then(res => {
    app.listen(3000)
}).catch(() => {
    process.exit(1)
})