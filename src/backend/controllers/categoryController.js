import Recruitment from "../models/Recruitment";
import Community from "../models/Community";
import Comment from "../models/Comment";
import User from "../models/User";

/**************************
        전체 게시물
**************************/
export const board = async (req, res) => {
  try {
    const {
      params: { kinds, currentPage },
    } = req;

    let numberOfArticles = null;
    const articlesPerPage = 2;
    const shownButtons = 9; // 홀수만
    let articleLists = null;

    if (kinds == "recruitments") {
      numberOfArticles = await Recruitment.count();
      articleLists = await Recruitment.find()
        .populate("user")
        .sort({ _id: -1 })
        .skip((currentPage - 1) * articlesPerPage)
        .limit(articlesPerPage);
    } else if (kinds == "communities") {
      numberOfArticles = await Community.count();
      articleLists = await Community.find()
        .populate("user")
        .sort({ _id: -1 })
        .skip((currentPage - 1) * articlesPerPage)
        .limit(articlesPerPage);
    }

    return res.status(200).render(`categories/board.pug`, {
      headTitle: kinds == "recruitments" ? "멤버 구하기 목록" : "커뮤니티 목록",
      bodyTitle: kinds == "recruitments" ? "멤버 구하기" : "커뮤니티",
      articleLists,
      numberOfArticles,
      articlesPerPage,
      currentPage,
      shownButtons,
      route: `categories/${kinds}`,
      errorMessage: "게시글이 없습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

/**************************
        게시물 검색
**************************/
let findTerm = undefined;
export const search = async (req, res) => {
  try {
    const {
      params: { kinds, currentPage },
      body: { searchTerm },
    } = req;

    // 검색 pagination에 필요
    if (searchTerm) {
      findTerm = searchTerm;
    }

    let numberOfArticles = null;
    const articlesPerPage = 2;
    const shownButtons = 9; // 홀수만
    let articleLists = null;

    const regexTitle = new RegExp(findTerm, "i");

    if (kinds == "recruitments") {
      numberOfArticles = await Recruitment.count({
        title: regexTitle,
      });
      articleLists = await Recruitment.find({
        title: regexTitle,
      })
        .populate("user")
        .sort({ _id: -1 })
        .skip((currentPage - 1) * articlesPerPage)
        .limit(articlesPerPage);
    } else if (kinds == "communities") {
      numberOfArticles = await Community.count({
        title: regexTitle,
      });
      articleLists = await Community.find({
        title: regexTitle,
      })
        .populate("user")
        .sort({ _id: -1 })
        .skip((currentPage - 1) * articlesPerPage)
        .limit(articlesPerPage);
    }

    return res.status(200).render(`categories/board.pug`, {
      headTitle: "검색 중...",
      bodyTitle: "검색 결과",
      articleLists,
      numberOfArticles,
      articlesPerPage,
      currentPage,
      shownButtons,
      route: `categories/${kinds}`,
      findTerm,
      errorMessage: "검색 결과가 없습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

/**************************
        게시물 등록
 **************************/
export const getEnrollment = (req, res) => {
  const {
    session: { user },
  } = req;

  return res.status(200).render(`categories/enrollment.pug`, {
    headTitle: "등록하기",
    bodyTitle: "글쓰기",
    user,
  });
};
export const postEnrollment = async (req, res) => {
  try {
    const {
      params: { kinds },
      body: { title, content },
      session: {
        user: { _id },
      },
    } = req;

    const user = await User.findById(_id);

    if (kinds == "recruitments") {
      const recruitment = await Recruitment.create({
        title,
        content,
        user: _id,
      });

      user.recruitment.push(recruitment.id);
      await user.save();
    } else if (kinds == "communities") {
      const community = await Community.create({
        title,
        content,
        user: _id,
      });

      user.community.push(community.id);
      await user.save();
    }

    return res.redirect(`/categories/${kinds}/1`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

/**************************
        게시글 보기
 **************************/
export const article = async (req, res) => {
  try {
    const {
      params: { kinds, articleId },
    } = req;

    let post = null;
    if (kinds == "recruitments") {
      post = await Recruitment.findById(articleId)
        .populate("user")
        .populate({
          path: "comment",
          populate: { path: "user" },
        });
    } else if (kinds == "communities") {
      post = await Community.findById(articleId)
        .populate("user")
        .populate({
          path: "comment",
          populate: { path: "user" },
        });
    }

    return res.status(200).render(`categories/article.pug`, {
      headTitle:
        kinds == "recruitments" ? "멤버 구하기 게시글" : "커뮤니티 게시글",
      bodyTitle: kinds == "recruitments" ? "멤버 구하기 " : "커뮤니티 ",
      kinds,
      route: `categories/${kinds}`,
      post,
      user: post.user,
      commentLists: post.comment,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

/**************************
         댓글 등록
 *************************/
export const comment = async (req, res) => {
  try {
    const {
      params: { kinds, articleId },
      body: { content },
      session: {
        user: { _id },
      },
    } = req;

    const commentData = await Comment.create({ content, user: _id });

    let post = null;
    if (kinds == "recruitments") {
      post = await Recruitment.findById(articleId);
    } else if (kinds == "communities") {
      post = await Community.findById(articleId);
    }

    post.comment.unshift(commentData.id);
    await post.save();

    const user = await User.findById(_id);
    user.comment.unshift(commentData.id);
    await user.save();

    return res.redirect(`/categories/${kinds}/${articleId}`);
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

/**************************
        게시글 수정
 *************************/
export const getArticleUpdate = async (req, res) => {
  try {
    const {
      params: { kinds, articleId },
      session: { user },
    } = req;

    let post = null;
    if (kinds == "recruitments") {
      post = await Recruitment.findById(articleId);
    } else if (kinds == "communities") {
      post = await Community.findById(articleId);
    }

    return res.status(200).render(`categories/articleUpdate.pug`, {
      headTitle: "수정하기",
      bodyTitle: "수정하기",
      user,
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
      params: { kinds, articleId },
      body: { title, content },
    } = req;

    if (kinds == "recruitments") {
      await Recruitment.findByIdAndUpdate(
        { _id: articleId },
        { title, content }
      );
    } else if (kinds == "communities") {
      await Community.findByIdAndUpdate({ _id: articleId }, { title, content });
    }

    return res.redirect(`/categories/${kinds}/${articleId}`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

/**************************
         댓글 수정
 *************************/
export const commentUpdate = async (req, res) => {
  try {
    const {
      params: { commentId },
      body: { value },
    } = req;

    const comment = await Comment.findByIdAndUpdate(
      { _id: commentId },
      {
        content: value,
      },
      { new: true }
    );

    return res.json({ value: comment.content, status: 200 });
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/**************************
        게시물 삭제
 *************************/
export const articleDelete = async (req, res) => {
  try {
    const {
      params: { kinds, articleId },
      session: {
        user: { _id },
      },
    } = req;

    let post = null;
    if (kinds == "recruitments") {
      post = await Recruitment.findByIdAndRemove({ _id: articleId }).populate({
        path: "comment",
        populate: { path: "user" },
      });

      await User.findByIdAndUpdate(
        { _id },
        { $pull: { recruitment: articleId } }
      );
    } else if (kinds == "communities") {
      post = await Community.findByIdAndRemove({ _id: articleId }).populate({
        path: "comment",
        populate: { path: "user" },
      });

      await User.findByIdAndUpdate(
        { _id },
        { $pull: { recruitment: articleId } }
      );
    }

    post.comment.forEach(async (element) => {
      await Comment.findByIdAndDelete({ _id: element.id });
      await User.findOneAndUpdate(
        { _id: element.user.id },
        {
          $pull: { comment: element.id },
        }
      );
    });

    return res.redirect(`/categories/${kinds}/1`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

/**************************
         댓글 삭제
 *************************/
export const commentDelete = async (req, res) => {
  try {
    const {
      params: { kinds, articleId, commentId },
    } = req;

    await Comment.findByIdAndDelete(commentId);

    if (kinds == "recruitments") {
      await Recruitment.findOneAndUpdate(
        { id: articleId },
        {
          $pull: { comment: commentId },
        }
      );
    } else if (kinds == "communities") {
      await Community.findOneAndUpdate(
        { id: articleId },
        {
          $pull: { comment: commentId },
        }
      );
    }

    await User.findOneAndUpdate(
      { comment: { $in: [commentId] } },
      { $pull: { comment: commentId } }
    );

    return res.redirect(`/categories/${kinds}/${articleId}`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
