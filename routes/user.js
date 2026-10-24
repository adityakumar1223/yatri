import express from "express";
import { asyncWrap, asyncWrapper } from "../utils/wrapAsync.js";
import passport from "passport";
import { saveRedirectUrl } from "../middleware.js";
import ExpressError from "../utils/ExpressError.js";
import {
  renderSignup,
  renderLogin,
  signup,
  login,
  logout,
} from "../controller/user.js";

const router = express.Router();

router
  .route("/login")
  .get(asyncWrap(renderLogin))
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/user/login",
      failureFlash: true,
    }),
    login,
  );

router.route("/signup").get(asyncWrap(renderSignup)).post(asyncWrap(signup));

router.get("/logout", asyncWrap(logout));

export { router };
