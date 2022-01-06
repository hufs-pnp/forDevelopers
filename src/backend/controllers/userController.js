import User from "../models/User.js";
import bcrypt from "bcrypt";

/****************************************
                회원가입
****************************************/
export const getJoin = (_, res) => {
  return res.status(200).render("users/join.pug", { pageTitle: "회원 가입" });
};
export const postJoin = async (req, res) => {
  try {
    const {
      body: { name, nickname, absence, email, password, pnp, github_url },
    } = req;

    const user = await User.create({
      name,
      nickname,
      absence,
      email,
      password,
      pnp,
      github_url,
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
    await user.save();

    req.session.user = user;
    req.session.loggedIn = true;
    req.session.localLogin = true;

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

/****************************************
        로컬 로그인 & sns 로그인
****************************************/
export const getLogin = (req, res) => {
  // 학교 웹메일로 로그인 안해서 생기는 error(구글)
  let error = undefined;
  if (req.session.flash) {
    error = req.session.flash.error;
    req.flash(); // error 비우기
  }

  return res
    .status(200)
    .render("users/login.pug", { pageTitle: "로그인", error });
};
export const postLogin = async (req, res) => {
  try {
    const {
      body: { email, password },
    } = req;

    const user = await User.findOne({ email });
    if (!user) {
      return res.sendStatus(400);
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.sendStatus(401);
    }

    req.session.user = user;
    req.session.loggedIn = true;
    req.session.localLogin = true;

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

/****************************************
              유저 프로필
****************************************/
export const profile = async (req, res) => {
  try {
    const {
      session: {
        user: { _id },
      },
    } = req;

    const user = await User.findOne({ _id });

    return res
      .status(200)
      .render("users/profile.pug", { pageTitle: "유저 프로필", user });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const getProfileUpdate = async (req, res) => {
  try {
    const {
      session: {
        user: { _id },
      },
    } = req;

    const user = await User.findOne({ _id });

    return res
      .status(200)
      .render("users/profileUpdate.pug", { pageTitle: "유저 프로필", user });
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};
export const postProfileUpdate = async (req, res) => {
  try {
    const {
      body,
      session: { user },
      file,
    } = req;

    const modifiedUser = await User.findByIdAndUpdate(
      user._id,
      {
        name: body.name,
        nickname: body.nickname,
        image_url: file ? `/${file.path}` : user.image_url,
        pnp: body.pnp,
        team: body.team,
        student_id: body.student_id,
        department: body.department,
        gender: body.gender,
        email: body.email,
        password: body.password,
        tech: body.tech,
        github_url: body.github_url,
        interest: body.interest,
        like: body.like,
        visit: body.visit,
      },
      { new: true }
    );

    req.session.user = modifiedUser;

    return res.redirect(`/users/${user._id}`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
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
              비밀번호 변경
****************************************/
export const getChangePassword = (_, res) => {
  return res
    .status(200)
    .render("users/changePassword.pug", { pageTitle: "비밀번호 변경하기" });
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
      console.log("현재 비밀번호가 다릅니다.");
      return res.redirect(`/users/${id}/password`);
    }

    user.password = new_password;
    await user.save();

    return res.redirect(`/users/${id}`);
  } catch (error) {
    console.log(error);
    return res.redirect(`/`);
  }
};
