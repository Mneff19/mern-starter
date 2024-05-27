// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification and detail views
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));
router.get("/detail/:carId", utilities.handleErrors(invController.buildByCarId));
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));
router.get("/edit/:inventory_id", utilities.handleErrors(invController.editInventoryJSON));

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

// Route to handle updating inventory
router.post("/update/", 
    invValidate.newInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

module.exports = router;