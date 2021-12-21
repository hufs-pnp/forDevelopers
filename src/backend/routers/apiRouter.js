import express from "express";
import passport from "passport";
import {
  passportGoogleFinish,
  requestNaverAccessToken,
  requestNaverToken,
  views,
  email,
} from "../controllers/apiController";
import "../passport.js";
import { chooseCategory } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/:category/:id([0-9a-f]{24})/views", chooseCategory, views);

apiRouter.get("/naver/login", requestNaverToken);
apiRouter.get("/naver/callback", requestNaverAccessToken);

apiRouter.get(
  "/google/login",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
apiRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/users/login" }),
  passportGoogleFinish
);

apiRouter.post("/email/auth", email);

export default apiRouter;
