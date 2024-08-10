const express = require("express")

const router = express.Router()

const bankAccountController = require("../controllers/account.controller.js")

router.get("/statement", bankAccountController.statement)

router.get("/balance", bankAccountController.getBalance)

router.post("/withdraw", bankAccountController.withdraw)

router.post("/deposit", bankAccountController.deposit)

router.post("/transfer", bankAccountController.transfer)

module.exports = router