import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/forDevelopers");

const db = mongoose.connection;

db.on("error", () => console.log("❌ Connection Failed."));
db.once("open", () => console.log("✅ Connected to db."));
