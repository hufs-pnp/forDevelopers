import express from "express";
import apiRouter from "./routers/apiRouter";
import communitiesRouter from "./routers/communitiesRouter";
import projectsRouter from "./routers/projectsRouter";
import rootRouter from "./routers/rootRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/backend/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/assets", express.static("assets"));

app.use("/", rootRouter);
app.use("/projects", projectsRouter);
app.use("/communities", communitiesRouter);
app.use("/api", apiRouter);

export default app;
