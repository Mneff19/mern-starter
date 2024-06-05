const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
                  + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
                  + 'details"><img src="' + vehicle.inv_thumbnail 
                  +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
                  +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
                  + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
                  + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
    })
    grid += '</ul>'
    } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/* **************************************
* Build the detail view HTML
* ************************************ */
Util.buildDetailView = async function(data, isLoggedIn, accountDisplayName, accountId, inv_id){
  let detailView
  if(data["invData"].length > 0){
    const vehicle = data["invData"][0]
    detailView = '<section class="car-detail">'
      detailView += '<h1 class="car-detail--title">'
                      + vehicle.inv_year + ' '
                      + vehicle.inv_make + ' '
                      + vehicle.inv_model
                    + '</h1>';
      detailView += '<div class="details-wrapper">'
                      + '<img src="' + vehicle.inv_image +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model +' on CSE Motors" />'
                      + '<div class="details-wrapper--info">'
                        + '<h2 class="car-detail--title-small">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</h2>'
                        + '<p class="car-detail--price">$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</p>'
                        + '<p class="car-detail--description">' + vehicle.inv_description + '</p>'
                        + '<p class="car-detail--color"><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
                        + '<p class="car-detail--miles"><strong>Miles:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
                      + '</div>'
                    + '</div>'
    detailView += '</section>'
    detailView += '<section>'
                    + '<h2>Reviews</h2>'
      if(data["reviewData"].length > 0){
        const reviews = data["reviewData"]
        detailView += '<ul class="reviews-wrapper">'

        for (let review of reviews) {
          detailView += '<li class="reviews-wrapper--review">'
                          + '<h2 class="reviews-wrapper--review_reviewer">' + review.account_firstname[0] + review.account_lastname + '</h2>'
                          + '<p class="reviews-wrapper--review_date">' + review.review_date + '</p>'
                          + '<p class="reviews-wrapper--review_text">' + review.review_text + '</p>'
                        + '</li>'
        }
        detailView += '</ul>'
      } else {
        detailView += '<p class="notice">No reviews... [ADD MORE, SEE DOC/VID FOR DETAILS] </p>'
      }
        
      if(isLoggedIn) {
        detailView += '<p>Leave a review!</p>'
        detailView += this.buildReviewAddForm(accountDisplayName, accountId, inv_id)
      } else {
        detailView += '<p><a href="/account/login">Log in</a> to add a review!</p>'
      }
    detailView += '</section>'
  } else { 
    detailView += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return detailView
}

Util.buildReviewAddForm = function (displayName, accountId, invId) {
  form = "";

  form += '<form action="/review/add-review" method="post" class="review-form">'
        +    '<label for="displayname">Display Name</label>'
        +    '<input type="text" name="displayname" id="displayname" value="' + displayName + '" readonly required></input>'
        +    '<label for="review_text">Review Text</label>'
        +    '<input type="text" name="review_text" id="review_text" value="" required></input>'
        +    '<input type="hidden" name="inv_id" value="' + invId + '">'
        +    '<input type="hidden" name="account_id" value="' + accountId + '">'
        +    '<input type="submit" value="Add Review">'
        + '</form>';

  return form;
}

/* **************************************
* Build the classification select HTML
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
* Middleware to check authorization
**************************************** */
Util.checkNonBasicAuthorization = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     if(accountData.account_type != "Client") {
        next()
     } else {
        req.flash("notice", 'Sorry, you do not have access to this page.')
        return res.redirect("/account/login")
     }
    })
  } else {
    req.flash("Please log in")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util