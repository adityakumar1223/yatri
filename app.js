import dotenv from 'dotenv';
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import { router as listingsRouter } from "./routes/listing.js";
import { router as reviewsRouter } from "./routes/review.js";
import session from "express-session";
import MongoStore from 'connect-mongo';
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from "./models/user.js";
import {router as userRouter} from './routes/user.js';
import { error } from 'console';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbURL = process.env.MONGO_URL;
const app = express();

main()
.then((res) => {
  console.log("Connection sucessfull...");
})
.catch((err) => {
  console.log(err);
});

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
touchAfter: 24 * 60 * 60 ,
})

store.on("error",()=>{
  console.log("Error in the MONGO session store", error);
})


const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 *3,
    maxAge: 1000 * 60 * 60 * 24 *3,
    httpOnly: true,
  }
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());


app.engine("ejs", ejsMate);

let port = 3000;

async function main() {
  await mongoose.connect(dbURL);
}

//map testing
app.get("/map-test", (req, res) => {
  res.render("map-test", {
    mapToken: process.env.MAP_TOKEN
  });
});

app.get("/", (req, res) => {
  res.status(200).redirect("/listing");
});

app.use((req, res, next)=>{
  res.locals.sucessMsg = req.flash("sucess");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use("/listing", listingsRouter);
app.use("/listing/:id/reviews", reviewsRouter);
app.use("/user", userRouter);

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, `${req.path} not found`));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { err });
});

app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}/`);
});
