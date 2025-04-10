utilities/inventory-middleware.js
const inventoryAuth = (req, res, next) => {
    if (res.locals.loggedin) {
      const accountType = res.locals.accountData.account_type;
      if (accountType === "Employee" || accountType === "Admin") {
        next();
      } else {
        req.flash("notice", "Access denied. Employee or Admin status required.");
        return res.redirect("/account/login");
      }
    } else {
      req.flash("notice", "Please log in to access inventory management.");
      return res.redirect("/account/login");
    }
  };
  
  module.exports = inventoryAuth;