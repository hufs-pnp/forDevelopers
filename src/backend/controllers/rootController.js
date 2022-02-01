import User from "../models/User";

export const home = async (_, res) => {
  const userLists = await User.find().sort({ like: -1 }).limit(5);

  return res.render("home.pug", {
    pageTitle: "홈",
    userLists,
    emptyMessage: userLists.length > 0 ? null : "유저가 없습니다.",
  });
};
