const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// Route to handle "My Account" login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to handle "My Account" Register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

router.post("register", utilities.handleErrors(accountController.registerAccount))

module.exports = router