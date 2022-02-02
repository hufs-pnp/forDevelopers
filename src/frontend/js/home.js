/*************************
    유저 프로필 이미지 
*************************/
const profileImg = document.querySelector(
  "header .user-route .profile-button img"
);

if (profileImg) {
  const {
    dataset: { userid: userId },
  } = profileImg;

  fetch(`/api/${userId}/image`)
    .then((response) => response.json())
    .then((json) => {
      switch (json.status) {
        case 200:
          profileImg.src = json.image_url;
          return;
        case 404:
          alert("에러가 발생했습니다.");
          return;
      }
    });
}

/******************************
           홈 게시판
******************************/
const recruitmentBoard = document.querySelector(
  "main .board .first-row .recruitment"
);
const communityBoard = document.querySelector(
  "main .board .first-row .community"
);

function caculateTime(time) {
  const writtenTime = new Date(time);

  if (new Date().getDate() - writtenTime.getDate() != 0) {
    // 하루가 지났으면
    const month = writtenTime
      .toLocaleString("en", { month: "numeric" })
      .padStart(2, "0");
    const date = writtenTime
      .toLocaleString("en", { day: "numeric" })
      .padStart(2, "0");
    let hour = writtenTime
      .toLocaleString("en", { hour: "numeric", hour12: false })
      .padStart(2, "0");
    hour = hour == 24 ? "00" : hour;
    const minute = writtenTime
      .toLocaleString("en", { minute: "numeric" })
      .padStart(2, "0");

    return month + "/" + date + " " + hour + ":" + minute;
  }

  if (Math.abs(new Date().getHours() - writtenTime.getHours() != 0)) {
    // 시간
    return `${new Date().getHours() - writtenTime.getHours()}시간 전`;
  }

  if (Math.abs(new Date().getMinutes() - writtenTime.getMinutes() != 0)) {
    // 분
    return `${new Date().getMinutes() - writtenTime.getMinutes()}분 전`;
  }

  if (Math.abs(new Date().getSeconds() - writtenTime.getSeconds() != 0)) {
    // 초
    return `${new Date().getSeconds() - writtenTime.getSeconds()}초 전`;
  }
}

async function showRecruitmentBoard() {
  const response = await (await fetch(`/api/board/recruitments`)).json();
  const ul = recruitmentBoard.querySelector("ul");

  switch (response.status) {
    case 200:
      response.list.forEach((element) => {
        const time = caculateTime(element.created_at);
        const a = document.createElement("a");
        a.href = "categories/recruitments/" + element._id;
        a.innerHTML = `<div class="first-column">
                        <span class="title">${
                          element.title.length > 12
                            ? element.title.slice(0, 12) + "..."
                            : element.title
                        }</span>
                       </div>
                       <div class="second-column">
                        <span class="writer">${
                          element.user ? element.user.nickname : "탈퇴 인원"
                        }</span>
                        <span class="time">${time}</span>
                       </div> 
                        `;
        if (element.comment.length > 0) {
          a.classList.add("commentExist");
        }
        ul.appendChild(a);
      });
      return;
    case 201:
      recruitmentBoard.removeChild(ul);
      const span = document.createElement("span");
      span.innerText = "게시글이 없습니다.";
      span.classList.add("empty-msg");
      recruitmentBoard.appendChild(span);
      return;
    case 404:
      alert("에러가 발생했습니다.");
      return;
  }
}

async function showCommunityBoard() {
  const response = await (await fetch(`/api/board/communities`)).json();
  const ul = communityBoard.querySelector("ul");

  switch (response.status) {
    case 200:
      response.list.forEach((element) => {
        const time = caculateTime(element.created_at);
        const a = document.createElement("a");
        a.href = "categories/communities/" + element._id;
        a.innerHTML = `<div class="first-column">
                        <span class="title">${element.title}</span>
                       </div>
                       <div class="second-column">
                        <span class="writer">${
                          element.user ? element.user.nickname : "탈퇴 인원"
                        }</span>
                        <span class="time">${time}</span>
                       </div>
                        `;
        ul.appendChild(a);
      });
      return;
    case 201:
      communityBoard.removeChild(ul);
      const span = document.createElement("span");
      span.innerText = "게시글이 없습니다.";
      span.classList.add("empty-msg");
      communityBoard.appendChild(span);
      return;
    case 404:
      alert("에러가 발생했습니다.");
      return;
  }
}

showRecruitmentBoard();
showCommunityBoard();

/******************************
           유저 랭크 
******************************/
const userRankLists = document.querySelectorAll(
  "main .board .second-row .user-rank .rank-list ul a"
);
const left = document.querySelector(
  "main .board .second-row .user-rank .rank-list .left"
);
const right = document.querySelector(
  "main .board .second-row .user-rank .rank-list .right"
);

let currentPage = 0;
const maxPage = userRankLists.length - 1;

userRankLists[0].classList.remove("hidden");

left.addEventListener("click", () => {
  if (currentPage > 0) {
    userRankLists[currentPage].classList.add("hidden");
    currentPage -= 1;
    userRankLists[currentPage].classList.remove("hidden");
  }
});

right.addEventListener("click", () => {
  if (currentPage < maxPage) {
    userRankLists[currentPage].classList.add("hidden");
    currentPage += 1;
    userRankLists[currentPage].classList.remove("hidden");
  }
});
