const regValidate = require("../utilities/account-validation")
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// Route to handle "My Account" login view
router.get("/login", utilities.handleErrors(accountController.buildLogin))
// Route to handle "My Account" Register view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Route to handle registration form submission
router.post("/register", utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// router.get("/update/:account_id", utilities.checkLogin, accountController.buildAccountUpdate);
// router.post("/update", utilities.checkLogin, accountValidation.updateAccountRules(), accountValidation.checkAccountUpdateData, accountController.updateAccount);
// router.post("/update-password", utilities.checkLogin, accountValidation.updatePasswordRules(), accountValidation.checkPasswordData, accountController.updatePassword);

router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router