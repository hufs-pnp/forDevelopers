import "regenerator-runtime";

/************************
    github url 처리
************************/
const wrapper = document.querySelector(".first-column .wrapper:last-child");

const {
  dataset: { githuburl: github_url },
} = wrapper;

if (github_url == "empty") {
  const span = document.createElement("span");
  span.innerText = "no github";
  wrapper.appendChild(span);
} else {
  const a = document.createElement("a");
  a.href = github_url;
  a.target = "_blank";
  a.innerText = "visit github";
  wrapper.appendChild(a);
}

/***************************
      department 처리
***************************/
const firstRowDepartment = document.querySelector(
  ".hidden-column .first-row span:nth-child(2)"
);

const {
  dataset: { department },
} = firstRowDepartment;

if (department == "") {
  const strong = document.createElement("strong");
  strong.innerText = "Write your department";
  firstRowDepartment.appendChild(strong);
} else {
  const strong = document.createElement("strong");
  strong.innerText = department;
  firstRowDepartment.appendChild(strong);
}

/************************
      interest 처리
************************/
const firstRowInterest = document.querySelector(
  ".hidden-column .first-row span:last-child"
);

const {
  dataset: { interest },
} = firstRowInterest;

let interestString = "";
for (let i = 0; i < interest.length; i++) {
  if (interest[i] != '"' && interest[i] != "[" && interest[i] != "]") {
    interestString += interest[i];
  }
  if (interest[i] == ",") {
    interestString += " ";
  }
}

if (interest.length == 2) {
  const strong = document.createElement("strong");
  strong.innerText = "Write your interests";
  firstRowInterest.appendChild(strong);
} else {
  const strong = document.createElement("strong");
  strong.innerText = interestString;
  firstRowInterest.appendChild(strong);
}

/************************
       like 처리
************************/
const like = document.querySelector(".hidden-column .second-row .like");
const likeBtn = like.querySelector("i");

const {
  dataset: { id, login },
} = like;

likeBtn.addEventListener("click", async () => {
  // 로그인 안했으면
  if (login == undefined) return;

  const response = await (
    await fetch(`/api/users/${id}/like`, {
      method: "POST",
    })
  ).json();

  switch (response.status) {
    case 200:
      const span = document.createElement("span");
      span.innerText = response.like;
      like.children[like.children.length - 1].innerText = "";
      like.appendChild(span);
      break;
    case 400:
      alert("이미 좋아요를 누르셨습니다.");
      break;
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
  }
});

/*******************************************
        hover시에 profile 정보 보여주기
*******************************************/
const profileContainer = document.querySelector(".profile-container");
const hiddenColumn = document.querySelector(".hidden-column");

profileContainer.addEventListener("mouseenter", () => {
  hiddenColumn.style = "transform: scale(1, 1)";
  hiddenColumn.style.transition = "transform 0.3s ease-in";
});

profileContainer.addEventListener("mouseleave", () => {
  hiddenColumn.removeAttribute("style");
});

/*****************************
          에러 처리
*****************************/
const errorMessage = document.querySelector(".errorMessage");

const {
  dataset: { profileerrormsg: profileErrorMsg, userid: user_id },
} = errorMessage;

if (profileErrorMsg.length > 2) {
  const msg = profileErrorMsg.substr(1, profileErrorMsg.length - 2);
  alert(msg);
  window.location.href = `/users/${user_id}`;
}
