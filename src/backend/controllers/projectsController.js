import Recruitment from "../models/Recruitment.js";
import Order from "../models/Order.js";

// Projects
export const showProjects = (_, res) => {
  return res
    .status(200)
    .render("projects/projects.pug", { pageTitle: "프로젝트들" });
};

// Recruitments
export const recruitmentBoard = async (req, res) => {
  try {
    const {
      params: { currentPage },
    } = req;
    const category = "projects/recruitments";
    const numberOfArticles = await Recruitment.count();
    const articlesPerPage = 4;
    const shownButtons = 3; // 홀수만
    const articleLists = await Recruitment.find()
      .sort({ _id: -1 })
      .skip((currentPage - 1) * articlesPerPage)
      .limit(articlesPerPage);

    return res.status(200).render("projects/recruitments/board.pug", {
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

export const get_recruitment_Enrollment = (_, res) => {
  return res.status(200).render("projects/recruitments/enrollment.pug", {
    pageTitle: "등록하기",
  });
};
export const post_recruitment_Enrollment = async (req, res) => {
  try {
    const {
      body: { title, personnel, content },
    } = req;

    await Recruitment.create({
      title,
      personnel,
      content,
    });

    return res.redirect("/projects/recruitments/1");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const recruitmentPost = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Recruitment.findById(id);

    return res.status(200).render("projects/recruitments/post.pug", {
      pageTitle: "멤버 구하기 게시글",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const get_recruitmentPost_Update = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Recruitment.findById(id);

    return res.status(200).render("projects/recruitments/postUpdate.pug", {
      pageTitle: "수정하기",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
export const post_recruitmentPost_Update = async (req, res) => {
  try {
    const {
      params: { id },
      body: { title, personnel, content },
    } = req;

    await Recruitment.findByIdAndUpdate(
      { _id: id },
      { title, personnel, content }
    );

    return res.redirect(`/projects/recruitments/${id}`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const recruitmentPost_Delete = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    await Recruitment.findByIdAndRemove({ _id: id });
    return res.redirect("/projects/recruitments/1");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

// Orders
export const orderBoard = async (req, res) => {
  try {
    const {
      params: { currentPage },
    } = req;
    const category = "projects/orders";
    const numberOfArticles = await Order.count();
    const articlesPerPage = 4;
    const shownButtons = 3; // 홀수만
    const articleLists = await Order.find()
      .sort({ _id: -1 })
      .skip((currentPage - 1) * articlesPerPage)
      .limit(articlesPerPage);

    return res.status(200).render("projects/orders/board.pug", {
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

export const get_order_Enrollment = (_, res) => {
  return res.status(200).render("projects/orders/enrollment.pug", {
    pageTitle: "등록하기",
  });
};
export const post_order_Enrollment = async (req, res) => {
  try {
    const {
      body: { title, personnel, content },
    } = req;

    await Order.create({
      title,
      personnel,
      content,
    });

    return res.redirect("/projects/orders/1");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const orderPost = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Order.findById(id);

    return res.status(200).render("projects/orders/post.pug", {
      pageTitle: "멤버 구하기 게시글",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const get_orderPost_Update = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Order.findById(id);

    return res.status(200).render("projects/orders/postUpdate.pug", {
      pageTitle: "수정하기",
      post,
    });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
export const post_orderPost_Update = async (req, res) => {
  try {
    const {
      params: { id },
      body: { title, personnel, content },
    } = req;

    await Order.findByIdAndUpdate({ _id: id }, { title, personnel, content });

    return res.redirect(`/projects/orders/${id}`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const orderPost_Delete = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    await Order.findByIdAndRemove({ _id: id });
    return res.redirect("/projects/orders/1");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

// API
export const recruitmentViews = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Recruitment.findById(id);
    post.views += 1;
    await post.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const orderViews = async (req, res) => {
  try {
    const {
      params: { id },
    } = req;

    const post = await Order.findById(id);
    post.views += 1;
    await post.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
