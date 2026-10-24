import User from "../models/user.js"
import ExpressError from "../utils/ExpressError.js"

const renderLogin = async (req, res) => {
  res.status(200).render("./loginSignup/login.ejs");
};

const login = async (req, res) => {
  req.flash("sucess", "logged in sucessfully");
  let redirectUrl = res.locals.redirectUrl || "/listing";
  res.status(200).redirect(redirectUrl);
};

const signup = async (req, res) => {
  try {
    let user = req.body;
    let newUser = new User({
      name: user.name,
      username: user.username,
      email: user.email,
    });

    const registeredUser = await User.register(newUser, user.password);
    console.log(registeredUser);

    //direct login after signup
    req.login(registeredUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("sucess", "User logged in sucessfully");
      return res.status(200).redirect("/listing");
    });
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("/signup");
  }
};

const renderSignup = async (req, res) => {
  res.render("./loginSignup/signup.ejs");
};

const logout = async (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("sucess", "User logged out sucessfully");
    res.redirect("/listing");
  });
};

export { renderLogin, signup, renderSignup, login, logout };
