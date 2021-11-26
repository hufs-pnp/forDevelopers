import mongoose from "mongoose";

const recruitmentSchema = new mongoose.Schema({
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

const model = mongoose.model("Recruitment", recruitmentSchema);

export default model;
