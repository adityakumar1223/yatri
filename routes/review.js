import express from "express";
import { asyncWrap, asyncWrapper } from "../utils/wrapAsync.js";
import { isLoggedIn, isReviewOwner, validateReview } from "../middleware.js";
import { postReview, deleteReview, indexCallback } from "../controller/review.js";
import ExpressError from "../utils/ExpressError.js";

const router = express.Router({ mergeParams: true });

// #-> reviews routes
//reviews post route

router.route("/")
.get( asyncWrap(indexCallback))
.post( isLoggedIn, validateReview, asyncWrap(postReview));

// reviews delete route
router.delete("/:reviewId", isLoggedIn, isReviewOwner, asyncWrap(deleteReview));

export { router };
