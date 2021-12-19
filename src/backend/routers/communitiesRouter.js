import express from "express";
import {
  board,
  searchBoard,
  getEnrollment,
  postEnrollment,
  article,
  comment,
  getArticleUpdate,
  postArticleUpdate,
  articleDelete,
  commentDelete,
} from "../controllers/communitiesController";

const communitiesRouter = express.Router();

// 에러 처리 필요

communitiesRouter.get("/:currentPage([0-9]{1,10})", board);

communitiesRouter
  .route("/search/:currentPage([0-9]{1,10})")
  .get(searchBoard)
  .post(searchBoard);

communitiesRouter.route("/enrollment").get(getEnrollment).post(postEnrollment);

communitiesRouter.route("/:id([0-9a-f]{24})").get(article).post(comment);

communitiesRouter
  .route("/:id([0-9a-f]{24})/update")
  .get(getArticleUpdate)
  .post(postArticleUpdate);

communitiesRouter.get("/:id([0-9a-f]{24})/delete", articleDelete);

communitiesRouter.get(
  "/:communityId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/delete",
  commentDelete
);

export default communitiesRouter;
