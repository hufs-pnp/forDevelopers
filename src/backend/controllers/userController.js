import Recruitment from "../models/Recruitment";
import Community from "../models/Community";
import Comment from "../models/Comment";
import User from "../models/User";
import bcrypt from "bcrypt";

/****************************************
                회원가입
****************************************/
export const getJoin = (req, res) => {
  const joinErrorMsg = req.flash("join_error");

  return res
    .status(200)
    .render("users/join.pug", { headTitle: "회원 가입", joinErrorMsg });
};
export const postJoin = async (req, res) => {
  try {
    const {
      body: { name, nickname, absence, email, password, pnp, github_url },
    } = req;

    const user = await User.create({
      name,
      nickname,
      absence: absence == "" ? false : absence == "재학" ? false : true,
      email,
      password,
      pnp: pnp == "" ? false : pnp == "yes" ? true : false,
      github_url: github_url == "" ? "empty" : github_url,
    });

    if (req.body.web == "on") {
      user.interest.push("웹");
    }
    if (req.body.app == "on") {
      user.interest.push("앱");
    }
    if (req.body.algorithm == "on") {
      user.interest.push("알고리즘");
    }
    if (req.body.AI == "on") {
      user.interest.push("AI");
    }
    if (req.body.security == "on") {
      user.interest.push("보안");
    }
    if (req.body.data == "on") {
      user.interest.push("데이터");
    }
    user.visit += 1;
    user.visit_time = Date.now();
    await user.save();

    req.session.user = user;
    req.session.loggedIn = true;
    req.session.localLogin = true;

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    req.flash("join_error", "에러가 발생했습니다. 다시 한 번 진행해주세요.");
    return res.redirect("/users/join");
  }
};

/****************************************
           로그인 & 로그아웃
****************************************/
export const getLogin = (req, res) => {
  // 학교 웹메일로 로그인 안해서 생기는 error(구글)
  const snsLoginError = req.flash("error");

  return res
    .status(200)
    .render("users/login.pug", { headTitle: "로그인", snsLoginError });
};
export const postLogin = async (req, res) => {
  try {
    const {
      body: { email, password },
    } = req;

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: 400 });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.json({ status: 401 });
    }

    // 로그인 한지 하루 이상 지났으면
    if (Date.now() - user.visit_time >= 1000 * 60 * 60 * 24) {
      user.visit += 1;
      user.visit_time = Date.now();
      await user.save();
    }

    req.session.user = user;
    req.session.loggedIn = true;
    req.session.localLogin = true;

    return res.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return res.json({ status: 400 });
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

/****************************************
                회원 탈퇴
****************************************/
export const userDelete = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;

  req.session.user = undefined;
  req.session.loggedIn = undefined;
  req.session.localLogin = undefined;

  await User.findByIdAndRemove(_id);

  return res.redirect("/");
};

/****************************************
              유저 프로필
****************************************/
export const profile = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const user = await User.findById(id);
    const profileErrorMsg = req.flash("profile_error");

    return res.status(200).render("users/profile.pug", {
      headTitle: "유저 프로필",
      user,
      profileErrorMsg,
    });
  } catch (error) {
    console.log(error);
    req.flash("profile_error", "에러가 발생했습니다.");
    return res.redirect(`/users/${id}`);
  }
};

/****************************************
            유저 프로필 수정
****************************************/
export const getProfileUpdate = async (req, res) => {
  try {
    const {
      session: {
        user: { _id },
      },
    } = req;

    const user = await User.findOne({ _id });
    const profileUpdateErrorMsg = req.flash("profileUpdate_error");

    return res.status(200).render("users/profileUpdate.pug", {
      headTitle: "유저 프로필",
      user,
      profileUpdateErrorMsg,
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
export const postProfileUpdate = async (req, res) => {
  const {
    body,
    session: { user },
    file,
  } = req;

  try {
    const modifiedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name: body.name,
        nickname: body.nickname,
        introduction:
          body.introduction == "" ? "Introduce yourself!" : body.introduction,
        image_url: file ? `/${file.path}` : user.image_url,
        department: body.department == "" ? "empty" : body.department,
        github_url: body.github_url == "" ? "empty" : body.github_url,
      },
      { new: true }
    );

    // 재/휴학
    if (req.body.absenceYes == "on") {
      modifiedUser.absence = true;
    } else {
      modifiedUser.absence = false;
    }

    // pnp 가입 여부
    if (req.body.pnpYes == "on") {
      modifiedUser.pnp = true;
    } else {
      modifiedUser.pnp = false;
    }

    // 관심 분야
    modifiedUser.interest = [];

    if (req.body.web == "on") {
      modifiedUser.interest.push("웹");
    }
    if (req.body.app == "on") {
      modifiedUser.interest.push("앱");
    }
    if (req.body.algorithm == "on") {
      modifiedUser.interest.push("알고리즘");
    }
    if (req.body.AI == "on") {
      modifiedUser.interest.push("AI");
    }
    if (req.body.security == "on") {
      modifiedUser.interest.push("보안");
    }
    if (req.body.data == "on") {
      modifiedUser.interest.push("데이터");
    }
    await modifiedUser.save();

    req.session.user = modifiedUser;

    return res.redirect(`/users/${user._id}`);
  } catch (error) {
    console.log(error);
    req.flash("profileUpdate_error", "에러가 발생했습니다.");
    return res.redirect(`/users/${user._id}/update`);
  }
};

/****************************************
            내가 쓴 게시글 보기
****************************************/
export const userBoard = async (req, res) => {
  try {
    const {
      params: { currentPage, id },
    } = req;

    let numberOfArticles = null;
    const articlesPerPage = 2;
    const shownButtons = 9; // 홀수만
    let articleLists = [];

    const user = await User.findById(id);

    numberOfArticles = user.recruitment.length + user.community.length;

    // 이미 최신순으로 정렬되어 있음.
    const recruitmentLists = await Recruitment.find({
      user: { $in: [user.id] },
    }).populate("user");
    const newRecruitmentLists = recruitmentLists.map((element) => ({
      ...element._doc,
      userBoardRoute: "categories/recruitments",
    }));

    const communityLists = await Community.find({
      user: { $in: [user.id] },
    }).populate("user");
    const newCommunityLists = communityLists.map((element) => ({
      ...element._doc,
      userBoardRoute: "categories/communities",
    }));

    const totalLists = [...newRecruitmentLists, ...newCommunityLists];

    const start = (currentPage - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    for (let i = start; i < end; i++) {
      if (totalLists[i] === undefined) break;

      articleLists.push(totalLists[i]);
    }

    return res.status(200).render(`users/userBoard.pug`, {
      headTitle: "내가 쓴 게시물",
      bodyTitle: "내 게시물",
      userId: id,
      move: "board",
      articleLists,
      numberOfArticles,
      articlesPerPage,
      currentPage,
      shownButtons,
      errorMessage: "쓴 글이 없습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.redirect(`/users/${id}`);
  }
};

/****************************************
            내가 쓴 댓글 보기
****************************************/
export const userComment = async (req, res) => {
  try {
    const {
      params: { currentPage, id },
    } = req;

    let numberOfArticles = null;
    const articlesPerPage = 2;
    const shownButtons = 9; // 홀수만
    let articleLists = [];

    // 이미 최신순으로 정렬되어 있음.
    const user = await User.findById(id).populate("comment");

    numberOfArticles = user.comment.length;

    const totalLists = await Promise.all(
      user.comment.map(async (element) => {
        let post = null;
        if (element._doc.article_kinds == "recruitments") {
          post = await Recruitment.findById(element._doc.article_id).populate(
            "user"
          );
        } else if (element._doc.article_kinds == "communities") {
          post = await Community.findById(element._doc.article_id).populate(
            "user"
          );
        }

        return {
          ...post._doc,
          userBoardRoute: `categories/${element._doc.article_kinds}`,
        };
      })
    );

    const start = (currentPage - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    for (let i = start; i < end; i++) {
      if (totalLists[i] === undefined) break;

      articleLists.push(totalLists[i]);
    }

    return res.status(200).render(`users/userBoard.pug`, {
      headTitle: "내가 쓴 댓글",
      bodyTitle: "내 댓글",
      userId: id,
      move: "comment",
      articleLists,
      numberOfArticles,
      articlesPerPage,
      currentPage,
      shownButtons,
      errorMessage: "쓴 댓글이 없습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.redirect(`/users/${id}`);
  }
};

/****************************************
          내가 찜한 게시글 보기
****************************************/
export const userChoice = async (req, res) => {
  try {
    const {
      params: { currentPage, id },
    } = req;

    let numberOfArticles = null;
    const articlesPerPage = 2;
    const shownButtons = 9; // 홀수만
    let articleLists = [];

    // 이미 최신순으로 정렬되어 있음.
    const user = await User.findById(id).populate("choice");

    numberOfArticles = user.choice.length;

    const totalLists = await Promise.all(
      user.choice.map(async (element) => {
        let post = null;
        if (element._doc.kinds == "recruitments") {
          post = await Recruitment.findById(element._doc.id).populate("user");
        } else if (element._doc.kinds == "communities") {
          post = await Community.findById(element._doc.id).populate("user");
        }

        return {
          ...post._doc,
          kinds: element._doc.kinds,
          userBoardRoute: `categories/${element._doc.kinds}`,
        };
      })
    );

    const start = (currentPage - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    for (let i = start; i < end; i++) {
      if (totalLists[i] === undefined) break;

      articleLists.push(totalLists[i]);
    }

    return res.status(200).render(`users/userBoard.pug`, {
      headTitle: "내가 찜한 글",
      bodyTitle: "내 찜 목록",
      userId: id,
      move: "choice",
      userProfileId: id,
      articleLists,
      numberOfArticles,
      articlesPerPage,
      currentPage,
      shownButtons,
      errorMessage: "찜한 목록이 없습니다.",
    });
  } catch (error) {
    console.log(error);
    return res.redirect(`/users/${id}`);
  }
};

/****************************************
              비밀번호 수정
****************************************/
export const getChangePassword = (req, res) => {
  const {
    params: { id },
  } = req;

  return res.status(200).render("users/changePassword.pug", {
    headTitle: "비밀번호 변경하기",
    user_id: id,
  });
};
export const postChangePassword = async (req, res) => {
  try {
    const {
      params: { id },
      body: { current_password, new_password },
    } = req;

    const user = await User.findById(id);
    const valid = await bcrypt.compare(current_password, user.password);

    if (!valid) {
      return res.json({ status: 400 });
    }

    user.password = new_password;
    await user.save();

    return res.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};
