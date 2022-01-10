import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
import passport from "passport";
import flash from "connect-flash";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import projectsRouter from "./routers/projectsRouter";
import communitiesRouter from "./routers/communitiesRouter";
import apiRouter from "./routers/apiRouter";
import { localMiddlewares } from "./middlewares";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/backend/views");

dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.DB_URL,
    }),
    cookie: {
      maxAge: 24 * 60 * 60000, // one day
    },
  })
);
app.use("/assets", express.static("assets"));
app.use("/uploads", express.static("uploads"));
app.use(localMiddlewares);
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/projects", projectsRouter);
app.use("/communities", communitiesRouter);
app.use("/api", apiRouter);

export default app;
