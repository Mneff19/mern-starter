const accountModel = require("../models/account-model")
const utilities = require("../utilities/")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

const accountCont = {}

/* ***************************
 *  Build management view
 * ************************** */
accountCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/management", {
    title: "Account",
    nav,
    errors: null
  })
}

/* ***************************
 *  Build login view
 * ************************** */
accountCont.buildLoginView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
    title: "Login",
    nav,
    errors: null
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
accountCont.accountLogin = async function (req, res, next) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)
    if (!accountData) {
      req.flash("notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
      return
    }
    try {
      if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
        const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
        if(process.env.NODE_ENV === 'development') {
          res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
          } else {
            res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
          }
        return res.redirect("/account/")
      }
    } catch (error) {
      return new Error('Access Forbidden')
    }
}

/* ***************************
 *  Build registration view
 * ************************** */
accountCont.buildRegisterView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
accountCont.registerAccount = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ***************************
 *  Build update view
 * ************************** */
accountCont.buildUpdateView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/update", {
    title: "Update Account",
    nav,
    errors: null
  })
}

/* ****************************************
*  Process Updating Account Info
* *************************************** */
accountCont.updateAccountInfo = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const regResult = await accountModel.updateAccountInfo(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Info updated successfully!`
    )
    res.status(201).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process Changing Account Password
* *************************************** */
accountCont.changeAccountPassword = async function (req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  const regResult = await accountModel.changeAccountPassword(
    account_password,
    account_id
  )

  if (regResult) {
    req.flash(
      "notice",
      `Password changed successfully!`
    )
    res.status(201).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the change failed.")
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
* Handle log out
**************************************** */
accountCont.logout = async function (req, res, next) {
    res.clearCookie("jwt")
    req.flash(
      "notice",
      `Logged out!`
    )
    return res.redirect("/")
 }

module.exports = accountCont