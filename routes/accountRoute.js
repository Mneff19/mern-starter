// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities")
const regValidate = require('../utilities/account-validation')

// Route to build account view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagementView));

// Route to build login view
router.get("/login/", utilities.handleErrors(accountController.buildLoginView));

// Route to handle login
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

// Route to build register view
router.get("/register/", utilities.handleErrors(accountController.buildRegisterView));

// Route to handle registration
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;