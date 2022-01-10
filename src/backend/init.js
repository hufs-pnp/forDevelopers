import "regenerator-runtime";
import app from "./app.js";
import "./db.js";

const PORT = process.env.PORT || 4000;

app.listen(4000, () => console.log("✅ Listening on 4000"));
