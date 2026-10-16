import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import methodOverride from "method-override";
import ejsMate from "ejs-mate";
import ExpressError from "./utils/ExpressError.js";
import { router as listings } from "./routes/listing.js";
import { router as reviews } from "./routes/review.js";
import session from "express-session";
import flash from 'connect-flash';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from "./models/user.js";

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
const sessionOptions = {
  secret: "thisIsMySuperSecret",
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
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(new LocalStrategy(User.authenticate()));


app.engine("ejs", ejsMate);

let port = 3000;

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.status(200).redirect("/listing");
});

app.use((req, res, next)=>{
  res.locals.sucessMsg = req.flash("sucess");
  res.locals.error = req.flash("error");
  next();
})

app.use("/listing", listings);
app.use("/listing/:id/reviews", reviews);

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
