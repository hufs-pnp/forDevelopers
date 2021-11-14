import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    // default
  },
  pnp: {
    type: Boolean,
    default: "none",
  },
  team: {
    type: String,
    default: "none",
  },
  student_id: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tech: {
    type: String,
    default: "none",
  },
  github_url: {
    type: String,
    required: true,
  },
  interest: {
    type: String,
    default: "none",
  },
  like: {
    type: Number,
    default: 0,
  },
  visit: {
    type: Number,
    default: 0,
  },
  choice: {
    type: Number,
    default: 0,
  },
  hw_num: {
    type: Number,
    default: 0,
  },
  project_num: {
    type: Number,
    default: 0,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  member: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
  ],
  challenge: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Challenge",
    },
  ],
  answer: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Answer",
    },
  ],
});

const model = mongoose.model("User", userSchema);

export default model;
