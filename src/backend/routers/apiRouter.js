import express from "express";
import { views } from "../controllers/apiController";
import { viewsCategory } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/:category/:id([0-9a-f]{24})/views", viewsCategory, views);

export default apiRouter;
