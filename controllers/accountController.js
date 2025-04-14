const utilities = require("../utilities/")
const accountModel = require("../models/account-model") // Adjust path if needed
const bcrypt = require("bcryptjs") // Make sure bcrypt is installed
const { body, validationResult } = require("express-validator") // Make sure express-validator is installed

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null
  })
}



/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  console.log("Registration process started")
  let nav = await utilities.getNav()
  
  try {
    // Get form data
    const { client_firstname, client_lastname, client_email, client_password } = req.body
    console.log("Form data received:", { client_firstname, client_email }) // Don't log passwords
    
    // Check for existing email
    const emailExists = await accountModel.checkExistingEmail(client_email)
    if (emailExists) {
      console.log("Email already exists")
      req.flash("notice", "Email already exists. Please use a different email.")
      return res.status(409).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
    
    // Hash the password before storing
    const hashedPassword = await bcrypt.hashSync(client_password, 10)
    
    // Register the new account
    const regResult = await accountModel.registerAccount(
      client_firstname,
      client_lastname,
      client_email,
      hashedPassword // Use the hashed password here
    )

    console.log("Registration result:", regResult ? "Success" : "Failed")
    
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you're registered ${client_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    console.error("Registration error:", error)
    req.flash("notice", "An error occurred during registration: " + error.message)
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Build account update view
* *************************************** */
async function buildAccountUpdate(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const account_id = parseInt(req.params.account_id)
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData,
    })
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )

    if (updateResult) {
      // Get updated account data
      const accountData = await accountModel.getAccountById(account_id)
      req.flash("notice", "Account updated successfully")
      res.locals.accountData = accountData
      return res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData,
      })
    } else {
      req.flash("notice", "Failed to update account")
      const accountData = await accountModel.getAccountById(account_id)
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData,
        account_firstname,
        account_lastname,
        account_email,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Process password update
* *************************************** */
async function updatePassword(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const { account_password, account_id } = req.body
    // Hash the password
    const hashedPassword = await bcrypt.hashSync(account_password, 10)
    const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

    if (updateResult) {
      const accountData = await accountModel.getAccountById(account_id)
      req.flash("notice", "Password updated successfully")
      return res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData,
      })
    } else {
      req.flash("notice", "Failed to update password")
      const accountData = await accountModel.getAccountById(account_id)
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData,
      })
    }
  } catch (error) {
    next(error)
  }
}

/* ****************************************
*  Build management view
* *************************************** */
async function buildManagement(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationList,
      message: req.flash("notice")
    })
  } catch (error) {
    next(error)
  }
}

// Fix exports - use a single exports statement
module.exports = {
  buildLogin,
  buildRegister,
  registerAccount,
  buildAccountUpdate,
  updateAccount,
  updatePassword,
  buildManagement
}