import Recruitment from "../models/Recruitment.js";
import Order from "../models/Order.js";

// Projects
export const projects = (_, res) => {
  return res
    .status(200)
    .render("projects/projects.pug", { pageTitle: "프로젝트들" });
};

// Recruitments, Orders
export const board = async (req, res) => {
  try {
    const {
      params: { category, currentPage },
      body: { model },
    } = req;

    let numberOfArticles = null;
    const articlesPerPage = 4;
    const shownButtons = 3; // 홀수만
    let articleLists = null;

    if (model == "Recruitment") {
      numberOfArticles = await Recruitment.count();
      articleLists = await Recruitment.find()
        .sort({ _id: -1 })
        .skip((currentPage - 1) * articlesPerPage)
        .limit(articlesPerPage);
    } else if (model == "Order") {
      numberOfArticles = await Order.count();
      articleLists = await Order.find()
        .sort({ _id: -1 })
        .skip((currentPage - 1) * articlesPerPage)
        .limit(articlesPerPage);
    }

    return res.status(200).render(`projects/${category}/board.pug`, {
      pageTitle: "멤버 구하기 목록",
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

export const searchBoard = async (req, res) => {
  try {
    const {
      params: { category, currentPage },
      body: { model },
      query: { searchTerm },
    } = req;

    let numberOfArticles = null;
    const articlesPerPage = 4;
    const shownButtons = 3; // 홀수만
    let articleLists = null;

    const regexTitle = new RegExp(searchTerm, "i");

    if (model == "Recruitment") {
      numberOfArticles = await Recruitment.count({
        title: regexTitle,
      });
      articleLists = await Recruitment.find({
        title: regexTitle,
      })
        .sort({ _id: -1 })
        .skip((currentPage - 1) * articlesPerPage)
        .limit(articlesPerPage);
    } else if (model == "Order") {
      numberOfArticles = await Order.count({
        title: regexTitle,
      });
      articleLists = await Order.find({
        title: regexTitle,
      })
        .sort({ _id: -1 })
        .skip((currentPage - 1) * articlesPerPage)
        .limit(articlesPerPage);
    }

    return res.status(200).render(`projects/${category}/board.pug`, {
      pageTitle: "멤버 구하기 검색 목록",
      articleLists,
      numberOfArticles,
      articlesPerPage,
      currentPage,
      shownButtons,
      category,
      searchTerm,
    });
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

export const getEnrollment = (req, res) => {
  const {
    params: { category },
  } = req;

  return res.status(200).render(`projects/${category}/enrollment.pug`, {
    pageTitle: "등록하기",
  });
};
export const postEnrollment = async (req, res) => {
  try {
    const {
      params: { category },
      body: { title, personnel, content, model },
    } = req;

    if (model == "Recruitment") {
      await Recruitment.create({
        title,
        personnel,
        content,
      });
    } else if (model == "Order") {
      await Order.create({
        title,
        personnel,
        content,
      });
    }

    return res.redirect(`/projects/${category}/1`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const article = async (req, res) => {
  try {
    const {
      params: { category, id },
      body: { model },
    } = req;

    let post = null;

    if (model == "Recruitment") {
      post = await Recruitment.findById(id);
    } else if (model == "Order") {
      post = await Order.findById(id);
    }

    return res.status(200).render(`projects/${category}/article.pug`, {
      pageTitle: "멤버 구하기 게시글",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const getArticleUpdate = async (req, res) => {
  try {
    const {
      params: { category, id },
      body: { model },
    } = req;

    let post = null;

    if (model == "Recruitment") {
      post = await Recruitment.findById(id);
    } else if (model == "Order") {
      post = await Order.findById(id);
    }

    return res.status(200).render(`projects/${category}/articleUpdate.pug`, {
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
      params: { category, id },
      body: { title, personnel, content, model },
    } = req;

    if (model == "Recruitment") {
      await Recruitment.findByIdAndUpdate(
        { _id: id },
        { title, personnel, content }
      );
    } else if (model == "Order") {
      await Order.findByIdAndUpdate({ _id: id }, { title, personnel, content });
    }

    return res.redirect(`/projects/${category}/${id}`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const articleDelete = async (req, res) => {
  try {
    const {
      params: { category, id },
      body: { model },
    } = req;

    if (model == "Recruitment") {
      await Recruitment.findByIdAndRemove({ _id: id });
    } else if (model == "Order") {
      await Order.findByIdAndRemove({ _id: id });
    }

    return res.redirect(`/projects/${category}/1`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
