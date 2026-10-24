import express from "express";
import { asyncWrapper, asyncWrap } from "../utils/wrapAsync.js";
import { isLoggedIn, isOwner, validateSchema } from "../middleware.js";
import ExpressError from "../utils/ExpressError.js";
import {
  deleteListing,
  newListing,
  indexPage,
  renderNewForm,
  showIndividualListing,
  showUpdateListingPage,
  updateListing,
} from "../controller/listing.js";
import { storage } from "../cloudConfig.js";
import multer from "multer";

const upload = multer({ storage });

const router = express.Router();

//showing
router
  .route("/")
  .get(asyncWrapper(indexPage))
  .post(
    isLoggedIn,
    validateSchema,
    upload.single("listing[image]"),
    asyncWrapper(newListing),
  );

// new & create routes
router.get("/new", isLoggedIn, renderNewForm);

router
  .route("/:id")
  .get(asyncWrapper(showIndividualListing))
  .patch(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    asyncWrap(updateListing),
  );

//edit and update route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  asyncWrapper(showUpdateListingPage),
);

//delete route
router.delete("/:id/delete", isOwner, isLoggedIn, asyncWrap(deleteListing));

export { router };
