// utilities/index.js
// This adds to the existing utilities file

const invModel = require("../models/inventory-model");

const utilities = {};

// Error handling wrapper function
utilities.handleErrors = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

// Function to build navigation
utilities.getNav = async function() {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  data.forEach(item => {
    list += '<li><a href="/inv/type/' + 
      item.classification_id + 
      '" title="See our inventory of ' + 
      item.classification_name + 
      ' vehicles">' + 
      item.classification_name + 
      "</a></li>";
  });
  list += "</ul>";
  return list;
};
// Function to build classification dropdown list
utilities.buildClassificationList = async function(classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

module.exports = utilities;