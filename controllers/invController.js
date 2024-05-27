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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Manage Inventory",
    nav,
    classificationSelect,
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
  let classificationList = await utilities.buildClassificationList(classification_id)

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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Return Inventory Info for Editing As JSON
 * ************************** */
invCont.editInventoryJSON = async function (req, res, next) {
  const inventory_id = parseInt(req.params.inventory_id)
  
  const carData = await invModel.getInventoryByCarId(inventory_id);
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(carData[0].classification_id);
  
  if (carData) {
    const itemName = `${carData[0].inv_make} ${carData[0].inv_model}`
    res.status(201).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList,
      inv_id: carData[0].inv_id,
      inv_make: carData[0].inv_make,
      inv_model: carData[0].inv_model,
      inv_year: carData[0].inv_year,
      inv_description: carData[0].inv_description,
      inv_image: carData[0].inv_image,
      inv_thumbnail: carData[0].inv_thumbnail,
      inv_price: carData[0].inv_price,
      inv_miles: carData[0].inv_miles,
      inv_color: carData[0].inv_color,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, editing inventory failed. Please try again")
    res.status(501).render("inventory/management", {
      title: "Edit Inventory",
      nav,
      classificationSelect: classificationList,
      inventory_id,
      errors: null
    })
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  const { inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color, classification_id
  )
  let nav = await utilities.getNav()
  console.log(updateResult);

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash(
      "notice",
      `${itemName} was successfully updated!`
    )
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList: classificationSelect,
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
      errors: null
    })
  }
}

module.exports = invCont