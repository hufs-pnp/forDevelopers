import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  logout,
  userDelete,
  profile,
  getProfileUpdate,
  postProfileUpdate,
  userBoard,
  userComment,
  userChoice,
  getChangePassword,
  postChangePassword,
  getFindPassword,
  postFindPassword,
} from "../controllers/userController";
import { upload } from "../middlewares";

const userRouter = express.Router();

/******************
     회원가입
******************/
userRouter.route("/join").get(getJoin).post(postJoin);

/******************
      로그인
******************/
userRouter.route("/login").get(getLogin).post(postLogin);

/******************
     로그아웃
******************/
userRouter.get("/logout", logout);

/******************
     회원 탈퇴
******************/
userRouter.get("/delete", userDelete);

/******************
      프로필
******************/
userRouter.get("/:id([0-9a-f]{24})", profile);

/******************
    프로필 수정
******************/
userRouter
  .route("/:id([0-9a-f]{24})/update")
  .get(getProfileUpdate)
  .post(upload.single("image_url"), postProfileUpdate);

/***************************
    내가 쓴 게시글 보기
***************************/
userRouter.get("/:id([0-9a-f]{24})/board/:currentPage([0-9]{1,10})", userBoard);

/***************************
     내가 쓴 댓글 보기
***************************/
userRouter.get(
  "/:id([0-9a-f]{24})/comment/:currentPage([0-9]{1,10})",
  userComment
);

/***************************
   내가 찜한 게시글 보기
***************************/
userRouter.get(
  "/:id([0-9a-f]{24})/choice/:currentPage([0-9]{1,10})",
  userChoice
);

/******************
   비밀번호 수정
******************/
userRouter
  .route("/:id([0-9a-f]{24})/password")
  .get(getChangePassword)
  .post(postChangePassword);

/******************
   비밀번호 찾기
******************/
userRouter.route("/password/find").get(getFindPassword).post(postFindPassword);

export default userRouter;
