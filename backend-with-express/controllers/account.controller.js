
const { db } = require('../utils/sqlite.util.js')
const { sendOk, sendError } = require('../utils/http.util')

module.exports = {
  statement: (req, res) => {
    const { order = 'desc', page, limit } = req.query
    if (!page || !Number.isInteger(+page) || page < 0) {
      sendError(res, "Invalid page")
      return
    }
    if (!limit || !Number.isInteger(+limit) || limit <= 0) {
      sendError(res, "Invalid limit")
      return
    }
    const result = {
      page,
      limit,
      total: 0,
      records: []
    }
    // calculate the offset
    const offset = limit * (page - 1)
    db.get(`SELECT count(*) as total from bank_account`, (err, data) => {
      if (err) {
        sendError(res, "Error fetching statement")
        return
      }

      result.total = data.total

      let sql = `select id, amount, balance,category, createdAt from bank_account order by createdAt ${order === 'ascending' ? 'asc' : 'desc'} limit ? offset ?`

      const stmt = db.prepare(sql, limit, offset)
      stmt.all((err, data) => {
        if (err) {
          sendError(res, "Error fetching statement")
          return
        }
        result.records = data
        sendOk(res, "Statement fetched successfully", result)
      })
      stmt.finalize()
    })

  },

  getBalance: (req, res) => {
    db.get(`select balance from bank_account order by id desc limit 1`, (err, data) => {
      if (err) {
        sendError(res, "Error fetching statement")
      } else {
        sendOk(res, "Statement fetched successfully", {
          balance: data?.balance || 0
        })
      }
    })
  },

  withdraw: (req, res) => {
    const { amount } = req.body
    if (!amount || typeof amount !== "number") {
      sendError(res, "Please enter a number")
      return
    }
    if (amount <= 0) {
      sendError(res, "Please enter a positive number")
      return
    }

    try {
      // start transaction
      db.serialize(() => {
        // get the balance of latest transaction
        db.get(`select balance from bank_account order by id desc limit 1`, (err, row) => {
          if (err) {
            sendError(res, "error")
            return
          }

          if (!row || row.balance < amount) {
            sendError(res, "The balance is insufficient")
            return
          }

          const stmt = db.prepare(`insert into bank_account(amount, balance, category) values(?, ?, ?)`)
          stmt.run(amount, row.balance - amount, 'withdraw')
          stmt.finalize()
          sendOk(res, "success")
        })
      })
    } catch (err) {
      sendError(res, "error")
    }
  },

  deposit: (req, res) => {
    const { amount } = req.body
    if (!amount || typeof amount !== "number") {
      sendError(res, "Please enter a number")
      return
    }
    if (amount <= 0) {
      sendError(res, "Please enter a positive number")
      return
    }

    try {
      // start transaction
      db.serialize(() => {
        // get the balance of latest transaction
        db.get(`select balance from bank_account order by id desc limit 1`, (err, row) => {
          if (err) {
            sendError(res, "error")
            return
          }

          let balance = 0
          if (row) balance = row.balance
          const stmt = db.prepare(`insert into bank_account(amount, balance, category) values(?, ?, ?)`)
          stmt.run(amount, balance + amount, 'deposit')
          stmt.finalize()
          sendOk(res, "successful")
        })
      })
    } catch (err) {
      sendError(res, "error")
    }
  },

  transfer: (req, res) => {
    const { iban, amount } = req.body
    // check amount
    if (!amount || typeof amount !== "number") {
      sendError(res, "Please enter a number")
      return
    }
    if (amount <= 0) {
      sendError(res, "Please enter a positive number")
      return
    }

    // check IBAN
    const ibanRegex = /^[a-zA-Z]{2}\d{2}[a-zA-Z\d]{4}[\d]{7}([a-zA-Z\d]?){0,16}$/
    const valid = ibanRegex.test(iban)
    if (!valid) {
      sendError(res, "invalid IBAN")
      return
    }

    try {
      db.serialize(() => {
        // get the balance of latest transaction
        db.get(`select balance from bank_account order by id desc limit 1`, (err, row) => {
          if (err) {
            sendError(res, "error")
            return
          }
          if (!row || row.balance < amount) {
            sendError(res, "The balance is insufficient")
            return
          }

          const stmt = db.prepare(`insert into bank_account(amount, balance, category) values(?, ?, ?)`)
          stmt.run(amount, row.balance - amount, 'transfer')
          stmt.finalize()
          sendOk(res, "success")
        })
      })
    } catch (err) {
      sendError(res, "error")
    }
  }
}
