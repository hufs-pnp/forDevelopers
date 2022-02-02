import fetch from "node-fetch";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import Recruitment from "../models/Recruitment";
import User from "../models/User";
import Community from "../models/Community";
import Comment from "../models/Comment";

dotenv.config();

/*************************
    유저 프로필 이미지
*************************/
export const userImage = async (req, res) => {
  try {
    const {
      params: { userId },
    } = req;

    const user = await User.findById(userId);

    return res.json({ image_url: user.image_url, status: 200 });
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/*************************
       유저 좋아요
*************************/
export const userLike = async (req, res) => {
  try {
    const {
      params: { userId },
      session: {
        user: { _id },
      },
    } = req;

    const user = await User.findById(userId);

    let flag = true;
    for (let i = 0; i < user.like_clicked_user.length; i++) {
      if (user.like_clicked_user[i] == _id) {
        flag = false;
        break;
      }
    }

    if (flag) {
      user.like += 1;
      user.like_clicked_user.push(_id);
      await user.save();
      return res.json({ like: user.like, status: 200 });
    } else {
      return res.json({ status: 400 });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/*************************
      게시글 좋아요
*************************/
export const postLike = async (req, res) => {
  try {
    const {
      params: { kinds, articleId },
      session: {
        user: { _id },
      },
    } = req;

    let post = null;
    if (kinds == "recruitments") {
      post = await Recruitment.findById(articleId);
    } else if (kinds == "communities") {
      post = await Community.findById(articleId);
    }

    // 작성자와 좋아요 누른 사람이 같은 경우
    if (post.user._id == _id) {
      return res.json({ status: 401 });
    }

    // 이미 누른 유저인지 확인
    let flag = true;
    for (let i = 0; i < post.like_clicked_user.length; i++) {
      if (post.like_clicked_user[i] == _id) {
        flag = false;
        break;
      }
    }

    if (flag) {
      post.like += 1;
      post.like_clicked_user.push(_id);
      await post.save();
      return res.json({ like: post.like, status: 200 });
    } else {
      return res.json({ status: 400 });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/*************************
            찜 
*************************/
export const choice = async (req, res) => {
  try {
    const {
      params: { kinds, articleId },
      session: {
        user: { _id },
      },
    } = req;

    let post = null;
    if (kinds == "recruitments") {
      post = await Recruitment.findById(articleId);
    } else if (kinds == "communities") {
      post = await Community.findById(articleId);
    }

    let flag = true;
    for (let i = 0; i < post.choice_clicked_user.length; i++) {
      if (post.choice_clicked_user[i] == _id) {
        flag = false;
        break;
      }
    }

    if (flag) {
      post.choice += 1;
      post.choice_clicked_user.push(_id);
      await post.save();

      const user = await User.findById(_id);
      user.choice.unshift({ id: post.id, kinds });
      await user.save();

      return res.json({ choice: post.choice, status: 200 });
    } else {
      return res.json({ status: 400 });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/*************************
         찜 삭제
*************************/
export const deleteChoice = async (req, res) => {
  try {
    const {
      params: { kinds, articleId },
      session: {
        user: { _id },
      },
    } = req;

    if (kinds == "recruitments") {
      await Recruitment.findOneAndUpdate(
        { _id: articleId },
        {
          $pull: { choice_clicked_user: _id },
          $inc: { choice: -1 },
        }
      );
    } else if (kinds == "communities") {
      await Community.findOneAndUpdate(
        { _id: articleId },
        {
          $pull: { choice_clicked_user: _id },
          $inc: { choice: -1 },
        }
      );
    }

    await User.findOneAndUpdate(
      { _id },
      {
        $pull: { choice: { id: articleId } },
      }
    );

    return res.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/*************************
         조회 수 
*************************/
export const views = async (req, res) => {
  try {
    const {
      params: { kinds, articleId },
    } = req;

    let post = null;
    if (kinds == "recruitments") {
      post = await Recruitment.findById(articleId);
    } else if (kinds == "communities") {
      post = await Community.findById(articleId);
    }

    post.views += 1;
    await post.save();
    return res.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/*************************
        댓글 좋아요 
*************************/
export const commentLike = async (req, res) => {
  try {
    const {
      params: { kinds, articleId, commentId },
      session: {
        user: { _id },
      },
    } = req;

    let post = null;

    if (kinds == "recruitments") {
      post = await Recruitment.findById(articleId).populate("comment");
    } else if (kinds == "communities") {
      post = await Community.findById(articleId);
    }

    const comment = await Comment.findById(commentId);

    // 작성자와 좋아요 누른 사람이 같은 경우
    if (comment.user._id == _id) {
      return res.json({ status: 401 });
    }

    // 이미 누른 유저인지 확인
    let flag = true;
    for (let i = 0; i < comment.like_clicked_user.length; i++) {
      if (comment.like_clicked_user[i] == _id) {
        flag = false;
        break;
      }
    }

    if (flag) {
      comment.like += 1;
      comment.like_clicked_user.push(_id);
      await comment.save();
      return res.json({ like: comment.like, status: 200 });
    } else {
      return res.json({ status: 400 });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/*************************
      구글 로그인
*************************/
export const userDataInGoogle = async (_, __, profile, done) => {
  try {
    const {
      _json: { name, picture, email },
    } = profile;

    if (!email.includes("@hufs.ac.kr")) {
      return done(null, false, { message: "학교 웹메일로 로그인 해주세요." });
    }

    let user = await User.findOne({ email });
    if (!user) {
      const realName = name.split("[")[0];
      const department = name.split("/ ")[1].split("]")[0];
      let nickname = null;

      while (true) {
        nickname = `익명 ${parseInt(Math.random() * Math.pow(10, 5))}`;
        let existence = await User.findOne({ nickname });

        if (!existence) break;
      }

      user = await User.create({
        name: realName,
        nickname,
        image_url: picture,
        department,
        email,
        visit: 1, // 처음 가입이므로
        visit_time: Date.now(),
      });
    }

    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(null, false);
  }
};

export const passportGoogleFinish = async (req, res) => {
  const user = await User.findOne({ _id: req.user.id });

  // 로그인 한지 하루 이상 지났으면
  if (Date.now() - user.visit_time >= 1000 * 60 * 60 * 24) {
    user.visit += 1;
    user.visit_time = Date.now();
    await user.save();
  }

  req.session.user = req.user;
  req.session.loggedIn = true;
  req.session.localLogin = false;

  return res.redirect("/");
};

/**********************************
            이메일 확인
**********************************/
export const email = async (req, res) => {
  try {
    const {
      body: { email },
    } = req;

    // 학교 웹메일로 작성됐는지 확인
    // if (!email.includes("@hufs.ac.kr")) {
    //   return res.json({ status: 400 });
    // }

    //이미 가입되어 있는지 확인
    const user = await User.exists({ email });
    if (user) {
      return res.json({ status: 401 });
    }

    const transporter = nodemailer.createTransport({
      service: "Naver",
      auth: {
        user: process.env.DEVS_ID,
        pass: process.env.DEVS_PASSWORD,
      },
    });

    randomCode = parseInt(Math.random() * Math.pow(10, 6));

    const options = {
      from: process.env.DEVS_ID,
      to: email,
      subject: "forDevelopers 이메일 인증",
      html: `<div>
              <h2>이메일 인증</h2>
              <p>
                <h3>
                  안녕하세요. ${email.split("@")[0]}님.<br/>
                  아래의 코드를 입력하면 이메일 인증이 완료됩니다.<br/>
                </h3>
                <h2>
                  ${randomCode}
                </h2>
              </p>
             <div>`,
    };

    transporter.sendMail(options, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(info.response);
      }
    });

    return res.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/**********************************
            닉네임 확인
**********************************/
export const nickname = async (req, res) => {
  try {
    const {
      body: { nickname },
    } = req;

    const exist = await User.findOne({ nickname });

    if (exist) {
      return res.json({ status: 400 });
    } else {
      return res.json({ status: 200 });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/**********************************
          인증코드 확인
**********************************/
let randomCode = null;
export const code = async (req, res) => {
  try {
    const {
      body: { code: userCode },
    } = req;

    if (userCode == randomCode) {
      return res.json({ status: 200 });
    } else {
      return res.json({ status: 400 });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/***********************************
             홈 게시판
***********************************/
export const homeBoard = async (req, res) => {
  try {
    const {
      params: { kinds },
    } = req;

    let boardList = null;
    if (kinds == "recruitments") {
      boardList = await Recruitment.find()
        .populate("user")
        .sort({ _id: -1 })
        .limit(5);
    } else if (kinds == "communities") {
      boardList = await Community.find()
        .populate("user")
        .sort({ _id: -1 })
        .limit(5);
    }

    if (boardList.length > 0) {
      return res.json({ list: boardList, status: 200 });
    } else {
      return res.json({ status: 201 });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};

/**********************************
     비밀번호 찾기 이메일 확인
**********************************/
export const passwordEmail = async (req, res) => {
  try {
    const {
      body: { email },
    } = req;

    // 학교 웹메일로 작성됐는지 확인
    // if (!email.includes("@hufs.ac.kr")) {
    //   return res.json({ status: 400 });
    // }

    // 가입되어 있는지 확인
    const user = await User.exists({ email });
    if (user) {
      return res.json({ status: 200 });
    } else {
      return res.json({ status: 401 });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: 404 });
  }
};
