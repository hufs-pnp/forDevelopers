import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
  profile,
  getProfileUpdate,
  postProfileUpdate,
  userDelete,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.route("/join").get(getJoin).post(postJoin);

userRouter.route("/login").get(getLogin).post(postLogin);

userRouter.get("/logout", logout);

userRouter.get("/:id([0-9a-f]{24})", profile);

userRouter
  .route("/:id([0-9a-f]{24})/update")
  .get(getProfileUpdate)
  .post(postProfileUpdate);

userRouter.get("/:id([0-9a-f]{24})/delete", userDelete);

export default userRouter;
