import express from "express";
import {
  board,
  search,
  getEnrollment,
  postEnrollment,
  article,
  comment,
  getArticleUpdate,
  postArticleUpdate,
  articleDelete,
  commentUpdate,
  commentDelete,
} from "../controllers/categoryController";

const categoryRouter = express.Router();

// 에러 처리 필요

/**************************
        전체 게시물
**************************/
categoryRouter.get(
  "/:kinds(recruitments|communities)/:currentPage([0-9]{1,10})",
  board
);

/**************************
       게시물 검색
**************************/
categoryRouter
  .route("/:kinds(recruitments|communities)/search/:currentPage([0-9]{1,10})")
  .get(search)
  .post(search);

/**************************
       게시물 등록
**************************/
categoryRouter
  .route("/:kinds(recruitments|communities)/enrollment")
  .get(getEnrollment)
  .post(postEnrollment);

/**************************
   게시물 보기 & 댓글 등록
**************************/
categoryRouter
  .route("/:kinds(recruitments|communities)/:articleId([0-9a-f]{24})")
  .get(article)
  .post(comment);

/**************************
        게시물 수정
**************************/
categoryRouter
  .route("/:kinds(recruitments|communities)/:articleId([0-9a-f]{24})/update")
  .get(getArticleUpdate)
  .post(postArticleUpdate);

/**************************
        댓글 수정
**************************/
categoryRouter.post("/comment/:commentId([0-9a-f]{24})/update", commentUpdate);

/**************************
        게시물 삭제
**************************/
categoryRouter.get(
  "/:kinds(recruitments|communities)/:articleId([0-9a-f]{24})/delete",
  articleDelete
);

/**************************
        댓글 삭제
**************************/
categoryRouter.get(
  "/:kinds(recruitments|communities)/:articleId([0-9a-f]{24})/comment/:commentId([0-9a-f]{24})/delete",
  commentDelete
);

export default categoryRouter;
