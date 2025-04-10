function checkInventoryAuth(req, res, next) {
    if (res.locals.loggedin) {
      const accountType = res.locals.accountData.account_type;
      if (accountType === "Employee" || accountType === "Admin") {
        next();
      } else {
        req.flash("notice", "You do not have permission to access inventory management");
        return res.redirect("/account/login");
      }
    } else {
      req.flash("notice", "Please log in to access this resource");
      return res.redirect("/account/login");
    }
  }
  
  module.exports = { checkInventoryAuth };