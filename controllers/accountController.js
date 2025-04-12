const utilities = require("../utilities/")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
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

module.exports = { buildLogin, buildRegister, registerAccount }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

const buildAccountUpdate = async (req, res, next) => {
  try {
    const account_id = parseInt(req.params.account_id);
    const accountData = await accountModel.getAccountById(account_id);
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      accountData,
    });
  } catch (error) {
    next(error);
  }
};

const updateAccount = async (req, res, next) => {
  try {
    const { account_firstname, account_lastname, account_email, account_id } = req.body;
    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    );

    if (updateResult) {
      // Get updated account data
      const accountData = await accountModel.getAccountById(account_id);
      req.flash("notice", "Account updated successfully");
      res.locals.accountData = accountData;
      return res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData,
      });
    } else {
      req.flash("notice", "Failed to update account");
      const accountData = await accountModel.getAccountById(account_id);
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData,
        account_firstname,
        account_lastname,
        account_email,
      });
    }
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { account_password, account_id } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hashSync(account_password, 10);
    const updateResult = await accountModel.updatePassword(hashedPassword, account_id);

    if (updateResult) {
      const accountData = await accountModel.getAccountById(account_id);
      req.flash("notice", "Password updated successfully");
      return res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        accountData,
      });
    } else {
      req.flash("notice", "Failed to update password");
      const accountData = await accountModel.getAccountById(account_id);
      return res.render("account/update", {
        title: "Update Account",
        nav,
        errors: null,
        accountData,
      });
    }
  } catch (error) {
    next(error);
  }
};

invCont.buildManagement = async function (req, res, next) {
  console.log("buildManagement function called")
  try {
    let nav = await utilities.getNav()
    console.log("Navigation retrieved")
    
    const classificationList = await utilities.buildClassificationList()
    console.log("Classification list built")
    
    console.log("Rendering management view")
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      classificationList,
      message: req.flash("notice")
    })
    console.log("Management view rendered")
  } catch (error) {
    console.error("Error in buildManagement:", error)
    next(error)
  }
}

module.exports = { buildLogin }