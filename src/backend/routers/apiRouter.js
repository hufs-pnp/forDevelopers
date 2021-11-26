import express from "express";
import { communityViews } from "../controllers/communitiesController";
import {
  recruitmentViews,
  orderViews,
} from "../controllers/projectsController";

const apiRouter = express.Router();

// Projects
apiRouter.post("/recruitments/:id([0-9a-f]{24})/views", recruitmentViews);
apiRouter.post("/orders/:id([0-9a-f]{24})/views", orderViews);

// Communities
apiRouter.post("/communities/:id([0-9a-f]{24})/views", communityViews);

export default apiRouter;
