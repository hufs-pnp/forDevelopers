import Recruitment from "../models/Recruitment.js";
import Order from "../models/Order.js";
import Community from "../models/Community.js";

export const views = async (req, res) => {
  try {
    const {
      params: { id },
      body: { model },
    } = req;

    let post = null;

    if (model == "Recruitment") {
      post = await Recruitment.findById(id);
    } else if (model == "Order") {
      post = await Order.findById(id);
    } else if (model == "Community") {
      post = await Community.findById(id);
    }

    post.views += 1;
    await post.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
