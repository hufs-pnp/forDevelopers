import fetch from "node-fetch";
import Recruitment from "../models/Recruitment.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Community from "../models/Community.js";

export const views = async (req, res) => {
  try {
    const {
      params: { id },
      body: { model },
    } = req;

    let post = null;

    if (model == "Recruitment") {
      post = await Recruitment.findById(id);
    } else if (model == "Order") {
      post = await Order.findById(id);
    } else if (model == "Community") {
      post = await Community.findById(id);
    }

    post.views += 1;
    await post.save();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(404);
  }
};

export const requestNaverToken = (_, res) => {
  try {
    const base_url = "https://nid.naver.com/oauth2.0/authorize";
    const params = {
      client_id: process.env.NAVER_CLIENT_ID,
      redirect_url: "http://localhost:4000/api/naver/callback",
      response_type: "code",
    };

    const params_url = new URLSearchParams(params).toString();
    const final_url = `${base_url}?${params_url}`;

    return res.redirect(final_url);
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};
export const requestNaverAccessToken = async (req, res) => {
  try {
    const base_url = "https://nid.naver.com/oauth2.0/token";
    const params = {
      grant_type: "authorization_code",
      client_id: process.env.NAVER_CLIENT_ID,
      client_secret: process.env.NAVER_CLIENT_SECRET,
      redirect_url: "http://localhost:4000/api/naver/callback",
      code: req.query.code,
    };

    const params_url = new URLSearchParams(params).toString();
    const final_url = `${base_url}?${params_url}`;

    const tokenRequest = await (
      await fetch(final_url, {
        headers: {
          Accept: "application/json",
        },
      })
    ).json();

    if ("access_token" in tokenRequest) {
      const { access_token } = tokenRequest;
      const userData = await (
        await fetch("https://openapi.naver.com/v1/nid/me", {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        })
      ).json();

      const {
        response: { name, email, profile_image },
      } = userData;

      let user = await User.findOne({ email });
      if (!user) {
        user = await User.create({
          name,
          email,
          image_url: profile_image,
        });
      }

      req.session.user = user;
      req.session.loggedIn = true;
      req.session.localLogin = false;

      return res.redirect("/");
    } else {
      console.log("access_token이 없습니다.");
      return res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/");
  }
};

export const userDataInGoogle = async (_, __, profile, done) => {
  try {
    const {
      _json: { name, picture, email },
    } = profile;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name,
        image_url: picture,
        email,
      });
    }

    return done(null, user);
  } catch (error) {
    console.log(error);
    return done(null, false, { message: "Error occurs" });
  }
};

export const passportGoogleFinish = (req, res) => {
  req.session.user = req.user;
  req.session.loggedIn = true;
  req.session.localLogin = false;

  return res.redirect("/");
};
