// Needed Resources 
const express = require("express")
const router = new express.Router() 
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")
const regValidate = require('../utilities/review-validation')

// Route to handle adding a review
router.post(
    "/add-review",
    regValidate.addRules(),
    regValidate.checkAddReviewData,
    utilities.handleErrors(reviewController.addReview)
);

// Route to build update view
router.get("/update/:review_id", utilities.handleErrors(reviewController.buildUpdateView));

// Route to handle updating reviews
router.post(
    "/update",
    regValidate.updateRules(),
    regValidate.checkUpdateReviewData,
    utilities.handleErrors(reviewController.updateReviewInfo)
);

// Route to build update view
router.get("/delete/:review_id", utilities.handleErrors(reviewController.deleteReviewJSON));

// Route to handle updating reviews
router.post(
    "/delete",
    // regValidate.updateRules(),
    // regValidate.checkUpdateReviewData,
    utilities.handleErrors(reviewController.deleteReview)
);

module.exports = router;