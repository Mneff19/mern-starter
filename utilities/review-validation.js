const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
// const reviewModel = require("../models/review-model")

/*  **********************************
*  Add Review Data Validation Rules
* ********************************* */
validate.addRules = () => {
    return [
        // valid email is required and cannot already exist in the database
        body("review_text")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage("Please provide review text at least 5 letters long."), // on error this message is sent.

        body("account_id")
        .trim()
        .isInt()
        .withMessage("A valid account ID is required."),

        body("inv_id")
        .trim()
        .isInt()
        .withMessage("A valid inventory ID is required."),
    ]
}

/* ******************************
* Check data and return errors or continue to add review
* ***************************** */
validate.checkAddReviewData = async (req, res, next) => {
    const { review_text, account_id, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        for (let error of errors.array()) {
            req.flash("notice", error.msg)
        }
        res.redirect("../inv/detail/" + inv_id)
        return
    }
    next()
}


/*  **********************************
*  Registration Data Validation Rules
* ********************************* */
validate.registationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
                throw new Error("Email exists. Please log in or use different email")
            }
        }),

        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkRegData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/register", {
        errors,
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        })
        return
    }
    next()
}




/*  **********************************
*  Update Info Data Validation Rules
* ********************************* */
validate.updateInfoRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.

        // lastname is required and must be string
        body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.

        // valid email is required and cannot already exist in the database
        body("account_email")
        .trim()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required.")
        .custom(async (account_email, req) => {
            const emailExists = await accountModel.checkExistingEmail(account_email)
            if (emailExists){
                const userWithEmail = await accountModel.getAccountByEmail(account_email)
                if (userWithEmail.account_id != req.req.body.account_id) {
                    throw new Error("Email is being used by another user. Please use a different email")
                }
            }
        }),

        // valid account_id is required and must be a number
        body("account_id")
        .trim()
        .isInt()
        .withMessage("A valid account ID is required."),
    ]
}

/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
        errors,
        title: "Update Account",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        account_id
        })
        return
    }
    res.locals.accountData.account_firstname = account_firstname;
    res.locals.accountData.account_lastname = account_lastname;
    res.locals.accountData.account_email = account_email;
    res.locals.accountData.account_id = account_id;
    next()
}


/*  **********************************
*  Change Password Data Validation Rules
* ********************************* */
validate.changePasswordRules = () => {
    return [
        // password is required and must be strong password
        body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
            minLength: 12,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),

        // valid account_id is required and must be a number
        body("account_id")
        .trim()
        .isInt()
        .withMessage("A valid account ID is required."),
    ]
}

/* ******************************
* Check data and return errors or continue to password change
* ***************************** */
validate.checkChangePasswordfData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
        errors,
        title: "Update Account",
        nav,
        })
        return
    }
    next()
}

module.exports = validate