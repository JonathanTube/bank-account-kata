
const request = require("supertest");
const app = require("../app")
const { initDB, db } = require('../utils/sqlite.util.js')

beforeAll(async () => {
    initDB()
})
describe("test operations about bank account", () => {
    it("the records of bank account should be empty at first", async () => {
        const res = await request(app).get("/api/statement?page=1&limit=2")
        console.log(res.body)
        expect(res.body.data.records).toEqual([])
    })

    it("deposit 100 to bank account", async () => {
        const amount = 100
        const resdeposite = await request(app).post("/api/deposit").send({ amount })
        expect(resdeposite.body.success).toEqual(true)

        const resBalance = await request(app).get("/api/balance")
        expect(resdeposite.body.success).toEqual(true)
        expect(resBalance.body.data.balance).toEqual(amount)
    })

    it("deposit str to bank account", async () => {
        const amount = 'hello'
        const resdeposite = await request(app).post("/api/deposit").send({ amount })
        expect(resdeposite.statusCode).toBe(200)
        expect(resdeposite.body.success).toEqual(false)
        expect(resdeposite.body.message).toEqual('Please enter a number')
    })

    it("deposit -100 to bank account", async () => {
        const amount = -100
        const resdeposite = await request(app).post("/api/deposit").send({ amount })
        expect(resdeposite.statusCode).toBe(200)
        expect(resdeposite.body.success).toEqual(false)
        expect(resdeposite.body.message).toEqual('Please enter a positive number')
    })

    it("withdraw 200 from bank account which is insufficient", async () => {
        const amount = 200
        const resBalance = await request(app).post("/api/withdraw").send({ amount })
        expect(resBalance.statusCode).toBe(200)
        expect(resBalance.body.success).toEqual(false)
        expect(resBalance.body.message).toEqual('The balance is insufficient')
    })

    it("withdraw 50 from bank account which is sufficient", async () => {
        const amount = 50
        const resBalance = await request(app).post("/api/withdraw").send({ amount })
        expect(resBalance.body.success).toEqual(true)
    })

    it("the balance should be 50", async () => {
        const resBalance = await request(app).get("/api/balance")
        expect(resBalance.body.data.balance).toEqual(50)
    })

    it("testing transfer to IBAN", async () => {
        // not a valid IBAN number
        const resBalanceInvalidIBAN = await request(app).post("/api/transfer").send({
            amount: 100,
            iban: 'xxxxxx'
        })
        expect(resBalanceInvalidIBAN.body.success).toEqual(false)
        expect(resBalanceInvalidIBAN.body.message).toEqual('invalid IBAN')
        //not enough money to transfer
        const resBalanceWithoutEnoughMoney = await request(app).post("/api/transfer").send({
            amount: 1100,
            iban: 'DE89370400440532013000'
        })
        expect(resBalanceWithoutEnoughMoney.body.success).toEqual(false)
        expect(resBalanceWithoutEnoughMoney.body.message).toEqual('The balance is insufficient')
        // transfer my money successfully
        const resBalanceWithSucc = await request(app).post("/api/transfer").send({
            amount: 25,
            iban: 'DE89370400440532013000'
        })
        expect(resBalanceWithSucc.body.success).toEqual(true)
    })

    it("the final balance should be 25", async () => {
        const resBalance = await request(app).get("/api/balance")
        expect(resBalance.body.data.balance).toEqual(25)
    })

    it("testing pagination with statement", async () => {
        const res = await request(app).get("/api/statement?page=1&limit=10")
        expect(res.body.data.total).toBe(3)
    })
})

afterAll(async () => {
    db.close()
})