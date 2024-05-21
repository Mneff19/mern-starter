const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory by details view
 * ************************** */
invCont.buildByCarId = async function (req, res, next) {
  const car_id = req.params.carId
  const data = await invModel.getInventoryByCarId(car_id)
  const detailView = await utilities.buildDetailView(data)
  let nav = await utilities.getNav()
  const carName = data[0].inv_make + " " + data[0].inv_model;
  res.render("./inventory/detail", {
    title: carName + " details",
    nav,
    detailView,
  })
}

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "Manage Inventory",
    nav,
  })
}

/* ***************************
 *  Build inventory add classification view
 * ************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
}

/* ***************************
 *  Build inventory add classification view
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body

  const addClassificationResult = await invModel.addClassification(
    classification_name
  )
  let nav = await utilities.getNav()

  if (addClassificationResult) {
    req.flash(
      "notice",
      `Classification added!`
    )
    res.status(201).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, adding classification failed. Please try again")
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  }
}

/* ***************************
 *  Build inventory add inventory view
 * ************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null
    })
}

/* ***************************
 *  Build inventory add inventory view
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body

  const addInventoryResult = await invModel.addInventory(
    inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
  )
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()

  if (addInventoryResult) {
    req.flash(
      "notice",
      `Inventory added!`
    )
    res.status(201).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, adding inventory failed. Please try again")
    res.status(501).render("inventory/add-inventory", {
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
      errors: null
    })
  }
}

module.exports = invCont