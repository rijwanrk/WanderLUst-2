// const express = require("express");
// const router = express.Router({mergeParams:true});
// const wrapAsync = require("../utils/wrapAsync.js");
// const ExpressError = require("../utils/ExpressError.js");
// const {reviewSchema} = require("../schema.js");
// const Review = require("../models/review.js");
// const Listing = require("../models/listing.js");
// const {validateReview, isLoggedIn ,isReviewAuthor} = require("../middleware.js");
// const reviewController = require("../controllers/reviews.js");

// const sendReviewNotificationEmail = require('../utils/sendEmail');
// const sendReviewNotificationSms = require('../utils/sendSms');
// const Listing = require('./models/Listing');  // assuming this is where you store listing info

// app.post('/api/reviews', async (req, res) => {
//   const { listingId, rating, comment, reviewerId } = req.body;
  
//   try {
//     // Save review to the database
//     const review = await Review.create({ listingId, rating, comment, reviewer: reviewerId });

//     // Fetch listing owner's contact information
//     const listing = await Listing.findById(listingId).populate('owner');
//     const ownerEmail = listing.owner.email;
//     const ownerPhone = listing.owner.phone;  // Ensure this field is available

//     // Send notifications
//     await sendReviewNotificationEmail(review, ownerEmail);
//     await sendReviewNotificationSms(review, ownerPhone);

//     res.status(201).json({ message: 'Review submitted and notifications sent.' });
//   } catch (error) {
//     res.status(500).json({ error: 'Error submitting review or sending notifications.' });
//   }
// });







// //Review Post Route
// router.post("/",isLoggedIn, validateReview , wrapAsync(reviewController.createReview));

// //DElete review route 
// router.delete("/:reviewId",isLoggedIn, isReviewAuthor,  wrapAsync(reviewController.deleteReview));

// module.exports = router;



const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");  // Only one import of Listing
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

const sendReviewNotificationEmail = require('../utils/sendEmail');
const sendReviewNotificationSms = require('../utils/sendSms');

// Review Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;  // This should be the listing ID from the URL parameter
    const { rating, comment } = req.body;  // Review data from request body
    
    try {
        // Save review to the database
        const review = await Review.create({ listing: id, rating, comment, reviewer: req.user._id });

        // Fetch the listing owner’s contact information
        const listing = await Listing.findById(id).populate('owner');
        const ownerEmail = listing.owner.email;
        const ownerPhone = listing.owner.phone;

        // Send notifications
        await sendReviewNotificationEmail(review, ownerEmail);
        await sendReviewNotificationSms(review, ownerPhone);

        req.flash('success', 'Review submitted and owner notified!');
        res.redirect(`/listings/${id}`);
    } catch (error) {
        req.flash('error', 'Error submitting review');
        res.redirect('back');
    }
}));

// Delete Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;
