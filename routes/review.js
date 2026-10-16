import express from 'express';
import Review from "../models/review.js";
import {reviewSchema} from '../schema.js';
import { asyncWrap, asyncWrapper } from '../utils/wrapAsync.js';
import ExpressError from '../utils/ExpressError.js';
import { Listing } from '../models/listing.js';

const router = express.Router({mergeParams: true});

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// #-> reviews routes
//reviews post route
router.post(
  "/",
  validateReview,
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let extractedInfo = req.body.review;

    let newReview = await Review.create(extractedInfo);
    listing.reviews.push(newReview);

    await newReview.save();
    let result = await listing.save();
    req.flash("sucess", "Review added sucessfully");

    console.log(result);
    res.status(200).redirect(`/listing/${id}`);
  }),
);


// reviews delete route

router.delete("/:reviewId", asyncWrap(async(req, res)=>{

  let {id, reviewId} = req.params;
  await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("sucess", "Review deleted sucessfully");
  res.status(200).redirect(`/listing/${id}`);

}));

export {router};