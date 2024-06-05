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

/* ***************************
 *  Build update view
 * ************************** */
reviewCont.buildUpdateView = async function (req, res, next) {
    let nav = await utilities.getNav()
    const review_id = parseInt(req.params.review_id)
    let reviewInfo = await reviewModel.getReviewById(review_id);

    res.render("./review/update", {
      title: "Update Review",
      nav,
      review_id: review_id,
      review_text: reviewInfo[0].review_text,
      account_id: reviewInfo[0].account_id,
      inv_id: reviewInfo[0].inv_id,
      errors: null
    })
  }

/* ****************************************
*  Process Updating Review Info
* *************************************** */
reviewCont.updateReviewInfo = async function (req, res) {
    let nav = await utilities.getNav()
    const { review_id, review_text, account_id, inv_id } = req.body

    const regResult = await reviewModel.updateReviewById(
        review_text,
        review_id
    )

    let reviewList = await utilities.buildAccountReviewList(res.locals.accountData.account_id);

    if (regResult) {
        req.flash(
        "notice",
        `Review updated successfully!`
        )
        res.status(201).render("account/management", {
        title: "Account",
        reviewList,
        nav,
        
        errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the update failed.")
        res.status(501).render("account/management", {
        title: "Account",
        nav,
        reviewList,
        errors: null,
        })
    }
}


/* ***************************
 *  Return Review Info for Deleting As JSON
 * ************************** */
reviewCont.deleteReviewJSON = async function (req, res, next) {
    const review_id = parseInt(req.params.review_id)
    
    const reviewData = await reviewModel.getReviewById(review_id);
    let nav = await utilities.getNav()
    
    if (reviewData) {
      res.status(201).render("review/delete", {
        title: "Delete Review",
        nav,
        review_id: reviewData[0].review_id,
        review_text: reviewData[0].review_text,
        errors: null
      })
    } else {
      let reviewList = await utilities.buildAccountReviewList(res.locals.accountData.account_id);
      req.flash("notice", "Sorry, deleting review failed. Please try again")
      res.status(501).render("account/management", {
        title: "Account",
        nav,
        reviewList,
        errors: null
      })
    }
  }
  
  /* ***************************
   *  Delete Review Data
   * ************************** */
  reviewCont.deleteReview = async function (req, res, next) {
    const { review_id } = req.body;
  
    const deleteResult = await reviewModel.deleteReview( review_id )
    let nav = await utilities.getNav()
    let reviewList = await utilities.buildAccountReviewList(res.locals.accountData.account_id);
  
    if (deleteResult) {
      req.flash(
        "notice",
        `Review was deleted!`
      )
      res.status(201).render("account/management", {
        title: "Account",
        nav,
        reviewList,
        errors: null
      })
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      res.status(501).render("account/management", {
        title: "Account",
        nav,
        reviewList,
        errors: null
      })
    }
  }

module.exports = reviewCont