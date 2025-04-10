// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities")

const { checkInventoryAuth } = require("../middleware/auth");

// Apply middleware only to administrative routes
router.get("/add-classification", checkInventoryAuth, invController.buildAddClassification);
router.post("/add-classification", checkInventoryAuth, invController.addClassification);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to build inventory item detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId)

// Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build add classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))

// Route to process the add classification form
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
)

// Route to build add inventory view
router.get("/add", utilities.handleErrors(invController.buildAddInventory))

// Route to process the add inventory form
router.post(
  "/add",
  invValidate.inventoryRules(),
  invValidate.checkInventoryData,
  utilities.handleErrors(invController.addInventoryItem)
)
module.exports = router