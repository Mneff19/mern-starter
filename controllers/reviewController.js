const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")
require("dotenv").config()

const reviewCont = {}

/* ****************************************
*  Process Adding a Review
* *************************************** */
reviewCont.addReview = async function (req, res) {
    let nav = await utilities.getNav()
    const { review_text, inv_id, account_id } = req.body

    const addResult = await reviewModel.addReview(
        review_text,
        inv_id,
        account_id
    )

    if (addResult) {
        req.flash(
            "notice",
            `Review added successfully!`
        )
        res.redirect("../inv/detail/" + inv_id)
    } else {
        req.flash("notice", "Sorry, the review failed.")
        res.redirect("../inv/detail/" + inv_id)
    }
}

/* ****************************************
*  Process Updating Review Info
* *************************************** */
reviewCont.updateReviewInfo = async function (req, res) {
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

module.exports = reviewCont