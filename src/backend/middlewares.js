// local variables only to the view(s) rendered
export const localMiddlewares = (req, res, next) => {
  res.locals.loggedInUser = req.session.user;
  res.locals.authenticated = req.session.loggedIn;
  res.locals.localLogin = req.session.localLogin;
  next();
};

import multer from "multer";

export const upload = multer({ dest: "uploads" });
