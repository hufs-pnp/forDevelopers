import Community from "../models/Community";
import Comment from "../models/Comment";
import User from "../models/User";

export const board = async (req, res) => {
  try {
    const {
      params: { currentPage },
    } = req;
    const category = "communities";
    const articlesPerPage = 4;
    const shownButtons = 3; // 홀수만
    let numberOfArticles = null;
    let articleLists = null;

    numberOfArticles = await Community.count();
    articleLists = await Community.find()
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

let findTerm = undefined;
export const searchBoard = async (req, res) => {
  try {
    const {
      params: { currentPage },
      body: { searchTerm },
    } = req;

    if (searchTerm) {
      findTerm = searchTerm;
    }

    const category = "communities";
    const articlesPerPage = 4;
    const shownButtons = 3; // 홀수만
    let numberOfArticles = null;
    let articleLists = null;

    const regexTitle = new RegExp(findTerm, "i");

    numberOfArticles = await Community.count({ title: regexTitle });
    articleLists = await Community.find({ title: regexTitle })
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
      findTerm,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const getEnrollment = (_, res) => {
  return res.status(200).render("communities/enrollment.pug", {
    pageTitle: "등록하기",
  });
};
export const postEnrollment = async (req, res) => {
  try {
    const {
      body: { title, category, content },
      session: {
        user: { _id },
      },
    } = req;

    const user = await User.findById(_id);

    const community = await Community.create({
      title,
      category,
      content,
      user: _id,
    });

    user.community.push(community.id);
    await user.save();

    return res.redirect("/communities/1");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const article = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Community.findById(id)
      .populate("user", "_id")
      .populate({
        path: "comment",
        populate: { path: "user" },
      });

    const commentLists = post.comment;

    return res.status(200).render("communities/article.pug", {
      pageTitle: "커뮤니티 게시글",
      post,
      commentLists,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
export const comment = async (req, res) => {
  try {
    const {
      params: { id },
      body: { content },
      session: {
        user: { _id },
      },
    } = req;

    const commentData = await Comment.create({ content, user: _id });

    const post = await Community.findById(id);
    post.comment.push(commentData.id);
    await post.save();

    const user = await User.findById(_id);
    user.comment.push(commentData.id);
    await user.save();

    return res.redirect(`/communities/${id}`);
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

export const getArticleUpdate = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Community.findById(id);

    return res.status(200).render("communities/articleUpdate.pug", {
      pageTitle: "수정하기",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
export const postArticleUpdate = async (req, res) => {
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

export const articleDelete = async (req, res) => {
  try {
    const {
      params: { id },
      session: {
        user: { _id },
      },
    } = req;

    const post = await Community.findByIdAndRemove({ _id: id }).populate({
      path: "comment",
      populate: { path: "user" },
    });

    await User.findByIdAndUpdate({ _id }, { $pull: { community: id } });

    post.comment.forEach(async (elem) => {
      await Comment.findByIdAndDelete({ _id: elem.id });
      await User.findOneAndUpdate(
        { _id: elem.user.id },
        {
          $pull: { comment: elem.id },
        }
      );
    });

    return res.redirect("/communities/1");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const commentDelete = async (req, res) => {
  try {
    const {
      params: { communityId, commentId },
    } = req;

    await Comment.findByIdAndDelete(commentId);

    await Community.findOneAndUpdate(
      { id: communityId },
      {
        $pull: { comment: commentId },
      }
    );

    await User.findOneAndUpdate(
      { $in: { comment: commentId } },
      { $pull: { comment: commentId } }
    );

    return res.redirect(`/communities/${communityId}`);
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
