// local variables only to the view(s) rendered
export const localMiddlewares = (req, res, next) => {
  res.locals.loggedInUser = req.session.user;
  res.locals.authenticated = req.session.loggedIn;
  res.locals.localLogin = req.session.localLogin;
  next();
};

export const chooseCategory = (req, res, next) => {
  const {
    params: { category },
  } = req;

  if (category == "recruitments") {
    req.body.model = "Recruitment";
  } else if (category == "orders") {
    req.body.model = "Order";
  } else if (category == "communities") {
    req.body.model = "Community";
  } else {
    return res.redirect("/");
  }

  return next();
};

import multer from "multer";

export const upload = multer({ dest: "uploads" });
