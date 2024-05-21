// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification and detail views
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:carId", utilities.handleErrors(invController.buildByCarId));

// Inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to handle adding classification
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassificationView));

router.post(
    "/add-classification",
    invValidate.newClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to handle adding inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventoryView));

router.post(
    "/add-inventory",
    invValidate.newInventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

module.exports = router;