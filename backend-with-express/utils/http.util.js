module.exports = {
    sendOk: (res, msg, data) => {
        res.header("Content-Type", "application/json")
        res.status(200)
        res.send({
            success: true,
            message: msg,
            data: data
        })
    },
    sendError: (res, msg) => {
        res.header("Content-Type", "application/json")
        res.status(200)
        res.send({
            success: false,
            message: msg
        })
    }
}