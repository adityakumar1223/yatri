import express from 'express';
import { asyncWrapper, asyncWrap } from '../utils/wrapAsync.js';
import ExpressError from "../utils/ExpressError.js";
import {Listing} from "../models/listing.js";
import { listingSchema } from '../schema.js';

const router = express.Router();

const validateSchema = (req, res, next) => {
  let { error, value } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  }
    req.body = value;
    next();
};

// new & create routes

router.get("/new", (req, res) => {
  res.status(200).render("./newProperty/newProperty.ejs");
});


router.post(
  "/",
  validateSchema,
  asyncWrapper(async (req, res, next) => {
    let newList = req.body.listing;
    let newListing = new Listing(newList);
    await newListing.save();
    req.flash("sucess", "new listing created");
    res.status(200).redirect("/listing");
  }),
);


//showing properties
router.get(
  "/",
  asyncWrapper(async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.status(200).render("./listings/index.ejs", { allListings });
  }),
);

router.get(
  "/:id",
  asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let property = await Listing.findById(id).populate("reviews");
    // console.log(property);
    if(!property){
      req.flash("error", "The listing doesn't exist");
      return res.status(200).redirect("/listing");
      
    }
    res.status(200).render("./listings/show.ejs", { property });
  }),
);

//update the listing

router.patch(
  "/:id",
  asyncWrap(async (req, res) => {
    if (!req.body) {
      throw new ExpressError(400, "please enter valid inputs");
    }
    let { id } = req.params;
    let list = req.body;
    let listing = await Listing.findByIdAndUpdate(id, list);    
    req.flash("sucess", "Listing updated Sucessfully");
    res.status(200).redirect(`/listing/${id}`);
  }),
);

//edit and update route
router.get(
  "/:id/edit",
  asyncWrapper(async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id);
    
    if(!list){
      req.flash("error", "The listing doesn't exist");
      return res.status(200).redirect("/listing");
      
    }
    res.status(200).render("./editing/edit.ejs", { list });
  }),
);

//delete route
router.delete(
  "/:id/delete",
  asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("sucess", "Listing deleted sucessfully");
    res.status(200).redirect("/listing");
  }),
);


export {router};