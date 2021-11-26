import Community from "../models/Community.js";

export const communityBoard = async (req, res) => {
  try {
    const {
      params: { currentPage },
    } = req;
    const category = "communities";
    const numberOfArticles = await Community.count();
    const articlesPerPage = 4;
    const shownButtons = 3; // 홀수만
    const articleLists = await Community.find()
      .sort({ _id: -1 })
      .skip((currentPage - 1) * articlesPerPage)
      .limit(articlesPerPage);

    return res.status(200).render("communities/board.pug", {
      pageTitle: "커뮤니티",
      articleLists,
      numberOfArticles,
      articlesPerPage,
      currentPage,
      shownButtons,
      category,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const get_community_Enrollment = (_, res) => {
  return res.status(200).render("communities/enrollment.pug", {
    pageTitle: "등록하기",
  });
};
export const post_community_Enrollment = async (req, res) => {
  try {
    const {
      body: { title, category, content },
    } = req;

    await Community.create({
      title,
      category,
      content,
    });

    return res.redirect("/communities/1");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const communityPost = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Community.findById(id);

    return res.status(200).render("communities/post.pug", {
      pageTitle: "커뮤니티 게시글",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const get_communityPost_Update = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Community.findById(id);

    return res.status(200).render("communities/postUpdate.pug", {
      pageTitle: "수정하기",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
export const post_communityPost_Update = async (req, res) => {
  try {
    const {
      params: { id },
      body: { title, category, content },
    } = req;

    await Community.findByIdAndUpdate(
      { _id: id },
      { title, category, content }
    );

    return res.redirect(`/communities/${id}`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const communityPost_Delete = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    await Community.findByIdAndRemove({ _id: id });
    return res.redirect("/communities/1");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

// API
export const communityViews = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Community.findById(id);
    post.views += 1;
    await post.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
