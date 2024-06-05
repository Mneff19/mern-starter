const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

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
*  Update Review Data Validation Rules
* ********************************* */
validate.updateRules = () => {
    return [
        // valid email is required and cannot already exist in the database
        body("review_text")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 5 })
        .withMessage("Please provide review text at least 5 letters long."), // on error this message is sent.

        body("review_id")
        .trim()
        .isInt()
        .withMessage("A valid account ID is required."),
    ]
}

/* ******************************
* Check data and return errors or continue to update review
* ***************************** */
validate.checkUpdateReviewData = async (req, res, next) => {
    const { review_text, account_id, inv_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let reviewList = await utilities.buildAccountReviewList(res.locals.accountData.account_id);
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/management", {
            title: "Account",
            nav,
            reviewList,
            errors,
        })
        return
    }
    next()
}

module.exports = validate