import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
    default: "Introduce yourself!",
  },
  image_url: {
    type: String,
    default:
      "https://graph.facebook.com/2703909133188815/picture?width=40&height=40",
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: "",
  },
  department: {
    type: String,
    default: "empty",
  },
  absence: {
    type: Boolean,
    default: false,
  },
  github_url: {
    type: String,
    default: "empty",
  },
  pnp: {
    type: Boolean,
    default: false,
  },
  interest: [
    {
      type: String,
      default: "",
    },
  ],
  like: {
    type: Number,
    default: 0,
  },
  like_clicked_user: [
    {
      type: String,
    },
  ],
  visit: {
    type: Number,
    default: 0,
  },
  visit_time: {
    type: Number,
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
  comment: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

const model = mongoose.model("User", userSchema);

export default model;
