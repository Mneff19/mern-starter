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
router.get("/edit/:inventory_id", utilities.checkNonBasicAuthorization, utilities.handleErrors(invController.editInventoryJSON));
router.get("/delete/:inventory_id",  utilities.checkNonBasicAuthorization, utilities.handleErrors(invController.deleteInventoryJSON));

// Inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to handle adding classification
router.get("/add-classification", utilities.checkNonBasicAuthorization, utilities.handleErrors(invController.buildAddClassificationView));

router.post(
    "/add-classification",
    utilities.checkNonBasicAuthorization,
    invValidate.newClassificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
);

// Route to handle adding inventory
router.get("/add-inventory", utilities.checkNonBasicAuthorization, utilities.handleErrors(invController.buildAddInventoryView));

router.post(
    "/add-inventory",
    utilities.checkNonBasicAuthorization,
    invValidate.newInventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
);

// Route to handle updating inventory
router.post("/update/", 
    utilities.checkNonBasicAuthorization,
    invValidate.newInventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory)
)

// Route to handle deleting inventory
router.post("/delete/",
    utilities.checkNonBasicAuthorization,
    utilities.handleErrors(invController.deleteInventory)
)

module.exports = router;