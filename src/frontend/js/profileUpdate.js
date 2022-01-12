import "regenerator-runtime";

/************************************************
   nav-btn에 따라서 보여주는 page를 다르게 하기
************************************************/
const navBtns = document.querySelectorAll(".nav-bar i");
const pages = document.querySelectorAll("form .page");

let currentPage = 0;

navBtns.forEach((btn, idx) => {
  btn.addEventListener("click", () => {
    pages[currentPage].classList.add("hide");
    pages[idx].classList.remove("hide");
    currentPage = idx;
  });
});

/****************************************
            닉네임 중복 확인
****************************************/
const nickname = document.querySelector(".nickname");
const nicknameInput = nickname.querySelector("input");
const nicknameBtn = nickname.querySelector("button");

nicknameBtn.addEventListener("click", async () => {
  const response = await (
    await fetch("/api/nickname/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname: nicknameInput.value }),
    })
  ).json();

  switch (response.status) {
    case 200:
      alert("사용가능한 닉네임입니다.");
      nicknameBtn.classList.add("verified");
      return;
    case 400:
      alert("중복된 닉네임입니다.\n다른 닉네임을 정해주세요.");
      return;
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
      return;
  }
});

nicknameInput.addEventListener("keyup", () => {
  nicknameBtn.classList.remove("verified");
});

/****************************************
          수정하기 전에 확인하기
****************************************/
const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!nicknameBtn.classList.contains("verified")) {
    return alert("중복 확인을 해주세요.");
  }

  form.submit();
});

/********************************
      email 못 바꾸게 하기
********************************/
const email = document.querySelector(".page .email");
const emailInput = email.querySelector("input");

emailInput.addEventListener("keydown", (event) => {
  event.preventDefault();
});

/************************************
      재/휴학 예, 아니요 자동바뀜
************************************/
const absence = document.querySelector(".absence");
const absenceYesBtn = absence.querySelector(".true input");
const absenceNoBtn = absence.querySelector(".false input");

absenceYesBtn.addEventListener("click", () => {
  absenceYesBtn.checked = true;
  absenceNoBtn.checked = false;
});

absenceNoBtn.addEventListener("click", () => {
  absenceNoBtn.checked = true;
  absenceYesBtn.checked = false;
});

/********************************
      pnp 예, 아니요 자동바뀜
********************************/
const pnp = document.querySelector(".pnp");
const pnpYesBtn = pnp.querySelector(".true input");
const pnpNoBtn = pnp.querySelector(".false input");

pnpYesBtn.addEventListener("click", () => {
  pnpYesBtn.checked = true;
  pnpNoBtn.checked = false;
});

pnpNoBtn.addEventListener("click", () => {
  pnpNoBtn.checked = true;
  pnpYesBtn.checked = false;
});

/****************************************
   interest db에 있는 것 화면에 보여주기
****************************************/
const interestData = document.querySelector(".profileUpdate-container");

const web = document.querySelector(".interest input[name='web']");
const app = document.querySelector(".interest input[name='app']");
const algorithm = document.querySelector(".interest input[name='algorithm']");
const AI = document.querySelector(".interest input[name='AI']");
const security = document.querySelector(".interest input[name='security']");
const data = document.querySelector(".interest input[name='data']");

let {
  dataset: { interest },
} = interestData;

let interestString = "";
for (let i = 0; i < interest.length; i++) {
  if (interest[i] != '"' && interest[i] != "[" && interest[i] != "]") {
    interestString += interest[i];
  }
}

const interestArray = interestString.split(",");

interestArray.forEach((element) => {
  switch (element) {
    case "웹":
      web.checked = true;
      break;
    case "앱":
      app.checked = true;
      break;
    case "알고리즘":
      algorithm.checked = true;
      break;
    case "AI":
      AI.checked = true;
      break;
    case "보안":
      security.checked = true;
      break;
    case "데이터":
      data.checked = true;
      break;
  }
});

/*******************************
           에러 처리
*******************************/
const errorMessage = document.querySelector(".errorMessage");

const {
  dataset: { profileupdateerrormsg: profileUpdateErrorMsg, userid: user_id },
} = errorMessage;

if (profileUpdateErrorMsg.length > 2) {
  const msg = profileUpdateErrorMsg.substr(1, profileUpdateErrorMsg.length - 2);
  alert(msg);
  window.location.href = `/users/${user_id}/update`;
}
