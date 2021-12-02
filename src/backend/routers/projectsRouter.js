import express from "express";
import {
  projects,
  board,
  getEnrollment,
  postEnrollment,
  article,
  getArticleUpdate,
  postArticleUpdate,
  articleDelete,
} from "../controllers/projectsController";
import { projectsCategory } from "../middlewares";

const projectsRouter = express.Router();

// 에러 처리 필요

projectsRouter.get("/", projects);

projectsRouter.get(
  "/:category/:currentPage([0-9]{1,10})",
  projectsCategory,
  board
);

projectsRouter
  .route("/:category/enrollment")
  .all(projectsCategory)
  .get(getEnrollment)
  .post(postEnrollment);

projectsRouter.get("/:category/:id([0-9a-f]{24})", projectsCategory, article);

projectsRouter
  .route("/:category/:id([0-9a-f]{24})/update")
  .all(projectsCategory)
  .get(getArticleUpdate)
  .post(postArticleUpdate);

projectsRouter.get(
  "/:category/:id([0-9a-f]{24})/delete",
  projectsCategory,
  articleDelete
);

export default projectsRouter;
