// This adds to the existing validation middleware

const validate = {};

// Middleware to validate classification data
validate.classificationRules = async (req, res, next) => {
  const { classification_name } = req.body;
  const classNamePattern = /^[A-Za-z0-9]+$/;
  
  // Check if classification name is valid
  if (!classNamePattern.test(classification_name)) {
    req.flash("error", "Classification name can only contain letters and numbers (no spaces or special characters).");
    return res.status(400).render("inventory/add-classification", {
      title: "Add New Classification",
      messages: req.flash()
    });
  }
  
  next();
};

// Check if classification name already exists
validate.checkExistingClassification = async (req, res, next) => {
  const { classification_name } = req.body;
  const invModel = require("../models/inventory-model");
  
  const classificationExists = await invModel.checkExistingClassification(classification_name);
  
  if (classificationExists) {
    req.flash("error", `Classification "${classification_name}" already exists.`);
    return res.status(409).render("inventory/add-classification", {
      title: "Add New Classification",
      messages: req.flash()
    });
  }
  
  next();
};

// Middleware to validate inventory data
validate.inventoryRules = async (req, res, next) => {
  const utilities = require("../utilities");
  const invModel = require("../models/inventory-model");
  
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body;
  
  let errors = [];
  
  // Validate classification
  if (!classification_id) {
    errors.push("Please select a classification");
  }
  
  // Validate make (at least 3 characters)
  if (inv_make.length < 3) {
    errors.push("Make must be at least 3 characters");
  }
  
  // Validate model (at least 3 characters)
  if (inv_model.length < 3) {
    errors.push("Model must be at least 3 characters");
  }
  
  // Validate description (at least 10 characters)
  if (inv_description.length < 10) {
    errors.push("Description must be at least 10 characters");
  }
  
  // Validate image path
  if (!inv_image.includes('.')) {
    errors.push("Please enter a valid image path");
  }
  
  // Validate thumbnail path
  if (!inv_thumbnail.includes('.')) {
    errors.push("Please enter a valid thumbnail path");
  }
  
  // Validate price (positive number)
  if (parseFloat(inv_price) <= 0) {
    errors.push("Price must be greater than zero");
  }
  
  // Validate year (between 1900 and current year + 1)
  const currentYear = new Date().getFullYear();
  if (parseInt(inv_year) < 1900 || parseInt(inv_year) > currentYear + 1) {
    errors.push(`Year must be between 1900 and ${currentYear + 1}`);
  }
  
  // Validate miles (non-negative)
  if (parseInt(inv_miles) < 0) {
    errors.push("Miles cannot be negative");
  }
  
  // Validate color (at least 3 characters)
  if (inv_color.length < 3) {
    errors.push("Color must be at least 3 characters");
  }
  
  // If there are errors, return to form with errors and sticky data
  if (errors.length > 0) {
    const classificationList = await utilities.buildClassificationList(classification_id);
    
    req.flash("error", errors.join(", "));
    return res.status(400).render("inventory/add-inventory", {
      title: "Add New Inventory",
      classificationList,
      inv: req.body,
      messages: req.flash()
    });
  }
  
  next();
};

module.exports = validate;