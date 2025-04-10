const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/* ********************************
 * Registration Data Validation Rules
 * ******************************** */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("client_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("client_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("client_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("client_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { client_firstname, client_lastname, client_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      client_firstname,
      client_lastname,
      client_email,
    })
    return
  }
  next()
}

const updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const account_id = req.body.account_id;
        const accountData = await accountModel.getAccountById(account_id);
        // Check if submitted email is different from existing email
        if (account_email !== accountData.account_email) {
          // Check if email exists in database
          const emailExists = await accountModel.checkExistingEmail(account_email);
          if (emailExists) {
            throw new Error("Email exists. Please use a different email");
          }
        }
      }),
  ];
};

const updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .isLength({ min: 12 })
      .withMessage("Password must be at least 12 characters")
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/)
      .withMessage("Password must contain at least one number, one uppercase letter, and one special character"),
  ];
};

// Middleware to check data and return errors
const checkAccountUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const accountData = await accountModel.getAccountById(req.body.account_id);
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_firstname,
      account_lastname,
      account_email,
      accountData,
    });
    return;
  }
  next();
};

const checkPasswordData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const accountData = await accountModel.getAccountById(req.body.account_id);
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors,
      accountData,
    });
    return;
  }
  next();
};

module.exports = validate