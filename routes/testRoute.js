const express = require("express")
const router = express.Router()
const testController = require("../controllers/testController")

router.get("/trigger-error", testController.triggerError)

module.exports = router