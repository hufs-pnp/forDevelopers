import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
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
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
});

const model = mongoose.model("Notice", noticeSchema);

export default model;
