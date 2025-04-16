
// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const { registrationRules } = require("../utilities/account-validation")
const validate = require("../utilities/account-validation")
const utilities = require("../utilities/")

// Route to build the login view
router.get("/login", accountController.buildLogin)

// Route to build the registration view
router.get("/register", accountController.buildRegister)

// Process the login attempt
router.post(
  "/login",
  validate.loginRules,
  utilities.handleErrors(accountController.accountLogin)
);

// Process the registration data
router.post(
  "/register",
  registrationRules,
  utilities.handleErrors(accountController.registerAccount)
)

router.get("/logout", utilities.handleErrors(accountController.accountLogout));


module.exports = router