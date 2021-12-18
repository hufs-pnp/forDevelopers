import express from "express";
import {
  projects,
  board,
  searchBoard,
  getEnrollment,
  postEnrollment,
  article,
  getArticleUpdate,
  postArticleUpdate,
  articleDelete,
} from "../controllers/projectsController";
import { chooseCategory } from "../middlewares";

const projectsRouter = express.Router();

// 에러 처리 필요

projectsRouter.get("/", projects);

projectsRouter.get(
  "/:category/:currentPage([0-9]{1,10})",
  chooseCategory,
  board
);

projectsRouter.get(
  "/:category/search/:currentPage([0-9]{1,10})",
  chooseCategory,
  searchBoard
);

projectsRouter
  .route("/:category/enrollment")
  .all(chooseCategory)
  .get(getEnrollment)
  .post(postEnrollment);

projectsRouter.get("/:category/:id([0-9a-f]{24})", chooseCategory, article);

projectsRouter
  .route("/:category/:id([0-9a-f]{24})/update")
  .all(chooseCategory)
  .get(getArticleUpdate)
  .post(postArticleUpdate);

projectsRouter.get(
  "/:category/:id([0-9a-f]{24})/delete",
  chooseCategory,
  articleDelete
);

export default projectsRouter;
