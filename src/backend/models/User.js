import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
    default:
      "https://graph.facebook.com/2703909133188815/picture?width=40&height=40",
  },
  pnp: {
    type: String,
    default: "",
  },
  team: {
    type: String,
    default: "",
  },
  student_id: {
    type: String,
    default: "",
  },
  department: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    default: "",
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
    default: "",
  },
  github_url: {
    type: String,
    default: "",
  },
  interest: {
    type: String,
    default: "",
  },
  like: {
    type: Number,
    default: 0,
  },
  visit: {
    type: Number,
    default: 0,
  },
  choice: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruitment",
    },
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
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
  recruitment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recruitment",
    },
  ],
  community: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const model = mongoose.model("User", userSchema);

export default model;
