import express from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { Listing } from "./models/listing.js";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import {asyncWrapper, asyncWrap} from './utils/wrapAsync.js';
import ExpressError from "./utils/ExpressError.js";
import listingSchema from "./schema.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGO_URL = "mongodb://127.0.0.1:27017/yatri";

main()
  .then((res) => {
    console.log("Connection sucessfull...");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

let port = 3000;

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.status(200).redirect("/listing");
});

app.get("/testListing", async (req, res) => {
  // let newList = new Listing({
  //     title: "Sea facing property",
  //     description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde iure aut ratione nostrum itaque ea, animi debitis tempora ab, perspiciatis dolorem assumenda amet? Omnis recusandae, animi voluptatum accusamus nulla repudiandae?",
  //     price: 1000,
  //     location: "Golden Beach, Puri",
  //     country: "India"
  // });
  await newList.save();
  console.log("sample was saved");
  res.send("Sucessfull testing");
});

// new & create routes

app.get("/listing/new", (req, res) => {
  res.status(200).render("./newProperty/newProperty.ejs");
});

const validateSchema = (req, res, next) =>{
   let {error} = listingSchema.validate(req.body);
   let errMsg = error.details.map((el) => el.message).join(",");
   if(error){
    throw new ExpressError(400, errMsg)
   }else{
    next();
   }
    console.log(result);
}

app.post("/listing", validateSchema, asyncWrapper(async (req, res, next) => {
   
    let newList = req.body.listing;
    let  newListing = new Listing(newList)
    await newListing.save();
    res.status(200).redirect("/listing");
}));

//showing properties
app.get("/listing", asyncWrapper(async (req, res) => {
  const allListings = await Listing.find({});
  // console.log(allListings);
  res.status(200).render("./listings/index.ejs",{allListings});
}));

app.get("/listing/:id", asyncWrapper(async (req, res) => {
  let { id } = req.params;
  let property = await Listing.findById(id);
  res.status(200).render("./listings/show.ejs", { property });
}));

//edit and update route
app.get("/listing/:id/edit", asyncWrapper(async (req, res) => {
  let { id } = req.params;
  let list = await Listing.findById(id);
  res.status(200).render("./editing/edit.ejs", { list });
}));

app.patch("/listing/:id", asyncWrap(async (req, res) => {
  if(!req.body){
    throw new ExpressError(400, "please enter valid inputs")
  }
  let { id } = req.params;
  let list = req.body;
  await Listing.findByIdAndUpdate(id, list);
  res.status(200).redirect("/listing");
}));

//delete route
app.delete("/listing/:id/delete", asyncWrap(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.status(200).redirect("/listing");
}));

app.all("/{*splat}", (req, res, next)=>{
  next(new ExpressError(404, `${req.path} not found`));
})

app.use((err, req, res,next) => {
  let {status = 500, message = "Something went wrong"} = err;
  res.status(status).render("error.ejs", {err});
});

app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}/`);
});
