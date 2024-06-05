// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")
const regValidate = require('../utilities/review-validation')

// Route to handle updating account info
router.post(
    "/add-review",
    regValidate.addRules(),
    regValidate.checkAddReviewData,
    utilities.handleErrors(reviewController.addReview)
);

module.exports = router;