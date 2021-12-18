import express from "express";
import {
  communityBoard,
  communitySearchBoard,
  get_community_Enrollment,
  post_community_Enrollment,
  communityPost,
  get_communityPost_Update,
  post_communityPost_Update,
  communityPost_Delete,
} from "../controllers/communitiesController";

const communitiesRouter = express.Router();

// 에러 처리 필요

communitiesRouter.get("/:currentPage([0-9]{1,10})", communityBoard);

communitiesRouter.get(
  "/search/:currentPage([0-9]{1,10})",
  communitySearchBoard
);

communitiesRouter
  .route("/enrollment")
  .get(get_community_Enrollment)
  .post(post_community_Enrollment);

communitiesRouter.get("/:id([0-9a-f]{24})", communityPost);

communitiesRouter
  .route("/:id([0-9a-f]{24})/update")
  .get(get_communityPost_Update)
  .post(post_communityPost_Update);

communitiesRouter.get("/:id([0-9a-f]{24})/delete", communityPost_Delete);

export default communitiesRouter;
