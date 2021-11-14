import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
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
  level: {
    type: String,
    default: "low",
  },
  tag: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

const model = mongoose.model("Challenge", challengeSchema);

export default model;
