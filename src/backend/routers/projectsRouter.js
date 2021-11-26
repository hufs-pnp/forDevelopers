import express from "express";
import {
  showProjects,
  // recruitment
  recruitmentBoard,
  get_recruitment_Enrollment,
  post_recruitment_Enrollment,
  recruitmentPost,
  get_recruitmentPost_Update,
  post_recruitmentPost_Update,
  recruitmentPost_Delete,
  // order
  orderBoard,
  get_order_Enrollment,
  post_order_Enrollment,
  orderPost,
  get_orderPost_Update,
  post_orderPost_Update,
  orderPost_Delete,
} from "../controllers/projectsController";

const projectsRouter = express.Router();

projectsRouter.get("/", showProjects);

// Recruitment
projectsRouter.get("/recruitments/:currentPage([0-9]{1,10})", recruitmentBoard);

projectsRouter
  .route("/recruitments/enrollment")
  .get(get_recruitment_Enrollment)
  .post(post_recruitment_Enrollment);

projectsRouter.get("/recruitments/:id([0-9a-f]{24})", recruitmentPost);

projectsRouter
  .route("/recruitments/:id([0-9a-f]{24})/update")
  .get(get_recruitmentPost_Update)
  .post(post_recruitmentPost_Update);

projectsRouter.get(
  "/recruitments/:id([0-9a-f]{24})/delete",
  recruitmentPost_Delete
);

// Order
projectsRouter.get("/orders/:currentPage([0-9]{1,10})", orderBoard);

projectsRouter
  .route("/orders/enrollment")
  .get(get_order_Enrollment)
  .post(post_order_Enrollment);

projectsRouter.get("/orders/:id([0-9a-f]{24})", orderPost);

projectsRouter
  .route("/orders/:id([0-9a-f]{24})/update")
  .get(get_orderPost_Update)
  .post(post_orderPost_Update);

projectsRouter.get("/orders/:id([0-9a-f]{24})/delete", orderPost_Delete);

export default projectsRouter;
