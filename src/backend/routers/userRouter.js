import express from "express";
import {
    edit, 
    remove, 
    logout,
    see, 
    startGoogleLogin, 
    finishGoogleLogin
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", startGoogleLogin);
userRouter.get("/github/finish", finishGoogleLogin);
userRouter.get(":id", see);

export default userRouter;                       