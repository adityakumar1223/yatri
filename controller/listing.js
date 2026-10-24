import { Listing } from "../models/listing.js";
import ExpressError from "../utils/ExpressError.js";
import { listingSchema } from "../schema.js";
import mbxGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';
import dotenv from 'dotenv';
dotenv.config();

const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({accessToken: mapToken});

const newListing = async (req, res, next) => {

  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  }).send();

  const geometry = response.body.features[0].geometry;
  // console.log("Features: "+ JSON.stringify(geometry));
  
  let url = req.file.path;
  let filename = req.file.filename;

  let newList = req.body.listing;
  let newListing = new Listing(newList);

  newListing.image = {url, filename};
  newListing.owner = req.user._id;
  newListing.geoLocation = geometry;

  console.log(newListing);
  await newListing.save();
  req.flash("sucess", "new listing created");
  res.status(200).redirect("/listing");
};

const indexPage = async (req, res) => {
  const allListings = await Listing.find({});
  res.status(200).render("./listings/index.ejs", { allListings });
};

const renderNewForm = (req, res) => {
  res.status(200).render("./newProperty/newProperty.ejs");
};

const showIndividualListing = async (req, res) => {
  let { id } = req.params;
  let property = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "owner" } })
    .populate("owner");
  if (!property) {
    req.flash("error", "The listing doesn't exist");
    return res.status(200).redirect("/listing");
  }
  // console.log(property);
  res.status(200).render("./listings/show.ejs", { property });
};

const updateListing = async (req, res) => {
  if (!req.body) {
    throw new ExpressError(400, "please enter valid inputs");
  }
  let { id } = req.params;
  // let listing = req.body;
  
  let listing = await Listing.findByIdAndUpdate(id,{ ...req.body.listing});

  if(typeof req.file !== "undefined"){
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = {url, filename};
  await listing.save();
  }

  req.flash("sucess", "Listing updated Sucessfully");  
  res.status(200).redirect(`/listing/${id}`);
};

const showUpdateListingPage = async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);

  if (!list) {
    req.flash("error", "The listing doesn't exist");
    return res.status(200).redirect("/listing");
  }

  let originalImageUrl = list.image.url;
  list.image.url = originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.status(200).render("./editing/edit.ejs", { list });
};

const deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("sucess", "Listing deleted sucessfully");
    res.status(200).redirect("/listing");
  };

export {
  newListing,
  renderNewForm,
  indexPage,
  showIndividualListing,
  updateListing,
  showUpdateListingPage,
  deleteListing,
};
