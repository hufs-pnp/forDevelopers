import User from "../models/User.js";
// import bcrypt from "bcrypt";

export const getJoin = (_, res) => {
  return res.status(200).render("users/join.pug", { pageTitle: "회원 가입" });
};
export const postJoin = async (req, res) => {
  try {
    const {
      body: { name, nickname, email, password, department },
    } = req;

    const checkAccount = await User.exists({ email });
    const checkNickname = await User.exists({ nickname });

    if (checkAccount) {
      // alert("이미 가입하셨습니다.");
      console.log("이미 가입하셨습니다.");
      return res.redirect("/");
    } else if (checkNickname) {
      console.log("이미 존재하는 닉네임입니다.");
      return res.redirect("/users/join");
    }

    const user = await User.create({
      name,
      nickname,
      email,
      password,
      department,
    });

    req.session.user = user;
    req.session.loggedIn = true;

    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const getLogin = (_, res) => {
  return res.status(200).render("users/login.pug", { pageTitle: "로그인" });
};
export const postLogin = async (req, res) => {
  try {
    const {
      body: { email, password },
    } = req;

    const user = await User.findOne({ email });

    if (!user) {
      console.log("회원 정보가 없습니다.");
      return res.redirect("/users/login");
    } else if (user.password !== password) {
      console.log("입력 정보가 잘못됐습니다.");
      return res.redirect("/users/login");
    }

    req.session.user = user;
    req.session.loggedIn = true;

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
    } = req;

    await User.findByIdAndUpdate(user._id, {
      name: body.name,
      nickname: body.nickname,
      image_url: body.image_url == "" ? user.image_url : body.image_url,
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
    });

    return res.redirect(`/users/${user._id}`);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const userDelete = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
  } = req;

  req.session.user = undefined;
  req.session.loggedIn = undefined;

  await User.findByIdAndRemove(_id);

  return res.redirect("/");
};
