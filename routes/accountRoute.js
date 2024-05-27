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

// Route to build update view
router.get("/update/:account_id", utilities.handleErrors(accountController.buildUpdateView));

// Route to handle updating account info
router.post(
    "/update-info",
    regValidate.updateInfoRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccountInfo)
);

// Route to handle changing account password
router.post(
    "/change-password",
    regValidate.changePasswordRules(),
    regValidate.checkChangePasswordfData,
    utilities.handleErrors(accountController.changeAccountPassword)
);

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

// Route to handle logout
router.get(
    "/logout",
    utilities.handleErrors(accountController.logout)
);

module.exports = router;