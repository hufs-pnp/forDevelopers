import express from "express";
import homeRouter from "./routers/homeRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/backend/views");

app.use("/assets", express.static("assets"));

app.get("/", homeRouter);

export default app;
