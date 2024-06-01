const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")

/*  **********************************
*  New Classification Data Validation Rules
* ********************************* */
validate.newClassificationRules = () => {
    return [
        // firstname is required and must be string
        body("classification_name")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .isAlpha()
        .withMessage("Please provide a valid classification name.") // on error this message is sent.
        .custom(async (classification_name) => {
            const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
            if (classificationExists){
                throw new Error("Classification exists. Please provide a different one")
            }
        }),
    ]
}

/* ******************************
* Check data and return errors or continue to add classification
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
        errors
        })
        return
    }
    next()
}

/*  **********************************
*  New Inventory Data Validation Rules
* ********************************* */
validate.newInventoryRules = () => {
    return [
        // inv_make is required and must be string
        body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a make."), // on error this message is sent.

        // inv_model is required and must be string
        body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a model."), // on error this message is sent.

        // valid inv_year is required and must be 4 ints
        body("inv_year")
        .trim()
        .isInt()
        .isLength(4)
        .withMessage("A valid year is required."),

        // inv_description is required and must be a string
        body("inv_description")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a description."),

        // inv_image is required and must be a string
        body("inv_image")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .matches("^\/images\/vehicles\/.*\.(jpg|png)$")
        .withMessage("Please provide a relative image path to a jpg or png in /images/vehicles."),

        // inv_thumbnail is required and must be a string
        body("inv_thumbnail")
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .matches("^\/images\/vehicles\/.*\.(jpg|png)$")
        .withMessage("Please provide a relative image path to a jpg or png in /images/vehicles."),

        // valid inv_miles is required and must be int
        body("inv_miles")
        .trim()
        .isInt()
        .isLength({ min: 1 })
        .withMessage("A valid mile amount is required."),

        // inv_color is required and must be string
        body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a color."), // on error this message is sent.

        // valid classification_id is required and must be int
        body("classification_id")
        .trim()
        .isInt()
        .isLength({ min: 1 })
        .withMessage("A valid classification id is required."),
    ]
}

/* ******************************
* Check data and return errors or continue to add inventory
* ***************************** */
validate.checkInventoryData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            classificationList,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            errors
        })
        return
    }
    next()
}

/* ******************************
* Check data and return errors or continue to add inventory
* ***************************** */
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/edit-inventory", {
            title: "Edit " + inv_make + inv_model,
            nav,
            classificationList,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            errors
        })
        return
    }
    next()
}

module.exports = validate