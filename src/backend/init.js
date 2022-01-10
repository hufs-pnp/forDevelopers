import "regenerator-runtime";
import app from "./app";
import "./db";

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log("✅ Listening on 4000"));
