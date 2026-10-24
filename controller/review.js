import { Listing } from "../models/listing.js";
import Review from "../models/review.js";
import { listingSchema } from "../schema.js";
import ExpressError from "../utils/ExpressError.js"

const indexCallback = async (req, res) => {
    let { id } = req.params;
    res.status(200).redirect(`/listing/${id}`);
  };

const postReview = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let extractedInfo = req.body.review;
    extractedInfo.owner = req.user._id;

    let newReview = await Review.create(extractedInfo);
    console.log(newReview);
    listing.reviews.push(newReview);

    await newReview.save();
    let result = await listing.save();
    req.flash("sucess", "Review added sucessfully");

    console.log(result);
    res.status(200).redirect(`/listing/${id}`);
  };

const deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess", "Review deleted sucessfully");
    res.status(200).redirect(`/listing/${id}`);
  };


  export {postReview, deleteReview, indexCallback};