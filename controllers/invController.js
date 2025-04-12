const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = await invModel.getClassificationNameById(classification_id)
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inventory_id)
  const vehicleView = await utilities.buildVehicleDisplay(data)
  let nav = await utilities.getNav()
  const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/detail", {
    title: vehicleName,
    nav,
    vehicleView,
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationList,
    message: req.flash("notice")
  })
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    message: null
  })
}

/* ***************************
 *  Process add classification form
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
  const addResult = await invModel.addClassification(classification_name)
  
  if (addResult) {
    req.flash("notice", {
      message: `The ${classification_name} classification was successfully added.`,
      type: "success"
    })
    res.redirect("/inv/")
  } else {
    req.flash("notice", {
      message: "Failed to add the new classification.",
      type: "error"
    })
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      message: req.flash("notice"),
      classification_name
    })
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationList,
    errors: null,
    message: null
  })
}

/* ***************************
 *  Process add inventory form
 * ************************** */
invCont.addInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id 
  } = req.body
  
  const classificationList = await utilities.buildClassificationList(classification_id)
  
  const addResult = await invModel.addInventoryItem(
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color, 
    classification_id
  )
  
  if (addResult) {
    req.flash("notice", {
      message: `The ${inv_make} ${inv_model} was successfully added to inventory.`,
      type: "success"
    })
    res.redirect("/inv/")
  } else {
    req.flash("notice", {
      message: "Failed to add the new vehicle to inventory.",
      type: "error"
    })
    res.status(501).render("inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
      message: req.flash("notice"),
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id
    })
  }
}

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

module.exports = invCont