// controllers/invController.js
const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {
  // Build inventory by classification view
  buildByClassificationId: async function(req, res, next) {
    try {
      const classification_id = req.params.classificationId;
      console.log("Classification ID requested:", classification_id);
      
      const data = await invModel.getInventoryByClassificationId(classification_id);
      console.log(`Found ${data ? data.length : 0} inventory items`);
      
      const grid = await utilities.buildClassificationGrid(data);
      let nav = await utilities.getNav();
      
      const className = await invModel.getClassificationNameById(classification_id);
      console.log("Classification name:", className);
      
      res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
      });
    } catch (error) {
      console.error("Error in buildByClassificationId:", error);
      next(error);
    }
  },

  // Build vehicle detail view
  buildByInventoryId: async function(req, res, next) {
    try {
      const inventory_id = req.params.inventoryId;
      const data = await invModel.getInventoryByInventoryId(inventory_id);
      
      if (!data || data.length === 0) {
        const err = new Error("Vehicle not found");
        err.status = 404;
        return next(err);
      }
      
      const vehicleView = await utilities.buildVehicleDisplay(data);
      let nav = await utilities.getNav();
      const vehicleName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
      
      res.render("./inventory/detail", {
        title: vehicleName,
        nav,
        vehicleView,
      });
    } catch (error) {
      console.error("Error in buildByInventoryId:", error);
      next(error);
    }
  },

  // Build inventory management view
  buildManagement: async function(req, res, next) {
    try {
      console.log("buildManagement function called");
      let nav = await utilities.getNav();
      console.log("Navigation retrieved");
      
      const classificationList = await utilities.buildClassificationList();
      console.log("Classification list built");
      
      console.log("Rendering management view");
      res.render("./inventory/management", {
        title: "Vehicle Management",
        nav,
        classificationList,
        message: req.flash("notice")
      });
      console.log("Management view rendered");
    } catch (error) {
      console.error("Error in buildManagement:", error);
      next(error);
    }
  },

  // Build add classification view
  buildAddClassification: async function(req, res, next) {
    try {
      let nav = await utilities.getNav();
      
      res.render("./inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
        message: null
      });
    } catch (error) {
      console.error("Error in buildAddClassification:", error);
      next(error);
    }
  },

  // Process add classification form
  addClassification: async function(req, res, next) {
    try {
      let nav = await utilities.getNav();
      const { classification_name } = req.body;
      
      const addResult = await invModel.addClassification(classification_name);
      
      if (addResult) {
        req.flash("notice", {
          message: `The ${classification_name} classification was successfully added.`,
          type: "success"
        });
        res.redirect("/inv/");
      } else {
        req.flash("notice", {
          message: "Failed to add the new classification.",
          type: "error"
        });
        res.status(501).render("inventory/add-classification", {
          title: "Add New Classification",
          nav,
          errors: null,
          message: req.flash("notice"),
          classification_name
        });
      }
    } catch (error) {
      console.error("Error in addClassification:", error);
      next(error);
    }
  },

  // Build add inventory view
  buildAddInventory: async function(req, res, next) {
    try {
      let nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList();
      
      res.render("./inventory/add-inventory", {
        title: "Add New Vehicle",
        nav,
        classificationList,
        errors: null,
        message: null
      });
    } catch (error) {
      console.error("Error in buildAddInventory:", error);
      next(error);
    }
  },

  // Process add inventory form
  addInventoryItem: async function(req, res, next) {
    try {
      let nav = await utilities.getNav();
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
      } = req.body;
      
      const classificationList = await utilities.buildClassificationList(classification_id);
      
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
      );
      
      if (addResult) {
        req.flash("notice", {
          message: `The ${inv_make} ${inv_model} was successfully added to inventory.`,
          type: "success"
        });
        res.redirect("/inv/");
      } else {
        req.flash("notice", {
          message: "Failed to add the new vehicle to inventory.",
          type: "error"
        });
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
        });
      }
    } catch (error) {
      console.error("Error in addInventoryItem:", error);
      next(error);
    }
  }
};

module.exports = invCont;