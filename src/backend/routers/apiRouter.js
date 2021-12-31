import express from "express";
import passport from "passport";
import {
  passportGoogleFinish,
  views,
  email,
  nickname,
  code,
} from "../controllers/apiController";
import "../passport.js";
import { chooseCategory } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/:category/:id([0-9a-f]{24})/views", chooseCategory, views);

apiRouter.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
apiRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/users/login",
    failureFlash: true,
  }),
  passportGoogleFinish
);

apiRouter.post("/email/auth", email);
apiRouter.post("/nickname/auth", nickname);
apiRouter.post("/code/auth", code);

export default apiRouter;
