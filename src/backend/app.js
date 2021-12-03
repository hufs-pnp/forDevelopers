import express from "express";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import projectsRouter from "./routers/projectsRouter";
import communitiesRouter from "./routers/communitiesRouter";
import apiRouter from "./routers/apiRouter";
import { localMiddlewares } from "./middlewares";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/backend/views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "oN3iF3P4NZkGxhhGS4c2mb7BEYuDdxYg",
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/assets", express.static("assets"));
app.use(localMiddlewares);

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/projects", projectsRouter);
app.use("/communities", communitiesRouter);
app.use("/api", apiRouter);

export default app;
