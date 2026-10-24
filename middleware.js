import { Listing } from "./models/listing.js";
import { reviewSchema } from "./schema.js";
import Review from './models/review.js';
import { listingSchema } from "./schema.js";

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must login first to perform the action");
    return res.status(401).redirect("/user/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have the permission to edit");
    return res.status(401).redirect(`/listing/${id}`);
  }
  next();
};

const isReviewOwner = async (req, res, next) => {
  let {id,  reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have the permission to make changes");
    return res.status(401).redirect(`/listing/${id}`);
  }
  next();
};


const validateSchema = (req, res, next) => {
  let { error, value } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
    req.body = value;
    next();
};


const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

export { isLoggedIn, saveRedirectUrl, isOwner , validateSchema, validateReview, isReviewOwner};
