import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  authority: {
    type: Boolean,
    default: true,
  },
});

const model = mongoose.model("Admin", adminSchema);

export default model;
