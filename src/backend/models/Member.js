import mongoose from "mongoose";

const memberSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  personnel: {
    type: Number,
    default: 1,
  },
  views: {
    type: Number,
    default: 0,
  },
  choice: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: String,
      default: "none",
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const model = mongoose.model("Member", memberSchema);

export default model;
