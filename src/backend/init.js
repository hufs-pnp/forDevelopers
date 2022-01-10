import "regenerator-runtime";
import app from "./app.js";
import "./db.js";

app.listen(4000, () => console.log("✅ Listening on 4000"));
