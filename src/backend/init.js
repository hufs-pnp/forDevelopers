import "regenerator-runtime";
import app from "./app.js";
import "./db.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("✅ Listening on 4000"));
