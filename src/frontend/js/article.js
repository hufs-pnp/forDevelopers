/*************************
      시간 반환 함수 
*************************/
function getTime(time, day, hours) {
  const newTimeForm = new Date(time);

  const year = newTimeForm.getFullYear() + "";
  const month = newTimeForm
    .toLocaleString("en", { month: "numeric" })
    .padStart(2, "0");
  const date = newTimeForm
    .toLocaleString("en", { day: "numeric" })
    .padStart(2, "0");
  let hour = newTimeForm
    .toLocaleString("en", { hour: "numeric", hour12: false })
    .padStart(2, "0");
  hour = hour == 24 ? "00" : hour;
  const minute = newTimeForm
    .toLocaleString("en", { minute: "numeric" })
    .padStart(2, "0");
  const second = newTimeForm
    .toLocaleString("en", { second: "numeric" })
    .padStart(2, "0");

  day.innerText = year + "/" + month + "/" + date;
  hours.innerText = hour + ":" + minute + ":" + second;
}

/*************************
    게시물 작성 시간
*************************/
const postTime = document.querySelector(".main .user .second-column .time");

const {
  dataset: { time: time1 },
} = postTime;

getTime(
  time1,
  postTime.querySelector(".day"),
  postTime.querySelector(".hours")
);

/*************************
     댓글 작성 시간
*************************/
const commentTime = document.querySelectorAll(
  ".comment-lists .comment-box .user .second-column .time"
);

commentTime.forEach((list) => {
  const {
    dataset: { time: time2 },
  } = list;

  getTime(time2, list.querySelector(".day"), list.querySelector(".hours"));
});

/*************************************
    좋아요, 댓글, 찜, 조회수 공통
*************************************/
const icons = document.querySelector(".icons");
const {
  dataset: { category, id, login },
} = icons;

/*************************
        좋아요 클릭
*************************/
const like = icons.querySelector(".like");

like.addEventListener("click", async () => {
  if (login === undefined) {
    alert("로그인 후 이용 가능합니다.");
    return;
  }

  const response = await (
    await fetch(`/api/${category}/${id}/like`, {
      method: "POST",
    })
  ).json();

  switch (response.status) {
    case 200:
      const count = like.querySelector("span");
      count.innerText = response.like;
      return;
    case 400:
      alert("이미 좋아요를 누르셨습니다.");
      return;
    case 401:
      alert("글 작성자는 누를 수 없습니다.");
      return;
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
      return;
  }
});

/*************************
         찜 클릭
*************************/
const choice = icons.querySelector(".choice");

choice.addEventListener("click", async () => {
  if (login === undefined) {
    alert("로그인 후 이용 가능합니다.");
    return;
  }

  const response = await (
    await fetch(`/api/${category}/${id}/choice`, {
      method: "POST",
    })
  ).json();

  switch (response.status) {
    case 200:
      const count = choice.querySelector("span");
      count.innerText = response.choice;
      return;
    case 400:
      alert("이미 찜하셨습니다.");
      return;
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
      return;
  }
});

/*************************
         조회 수
*************************/
const views = icons.querySelector(".views");

async function addViews() {
  const response = await (
    await fetch(`/api/${category}/${id}/views`, {
      method: "POST",
    })
  ).json();

  switch (response.status) {
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
      return;
  }
}

addViews();

/*************************
     댓글 좋아요 클릭
*************************/
const commentLikes = document.querySelectorAll(
  ".comment-lists .comment-box .comment-options .comment-like-btn"
);

commentLikes.forEach((like) => {
  const {
    dataset: { commentid: commentId },
  } = like;

  like.addEventListener("click", async () => {
    const response = await (
      await fetch(`/api/${category}/${id}/comment/${commentId}/like`, {
        method: "POST",
      })
    ).json();

    switch (response.status) {
      case 200:
        const count = like.previousElementSibling.children[1];
        count.innerText = response.like;
        return;
      case 400:
        alert("이미 좋아요를 누르셨습니다.");
        return;
      case 401:
        alert("댓글 작성자는 누를 수 없습니다.");
        return;
      case 404:
        alert("에러가 발생했습니다.");
        window.location.href = "/";
        return;
    }
  });
});

/*************************
     댓글 수정 클릭
*************************/
const modifyComments = document.querySelectorAll(".comment-lists .comment-box");

modifyComments.forEach((element) => {
  const originalComment = element.querySelector(".content");
  const modifyForm = element.querySelector(".hidden");
  const modifyBtn = element.querySelector(
    ".comment-options .comment-modify-btn"
  );

  const submitBtn = modifyForm.querySelector(".modify");
  const cancelBtn = modifyForm.querySelector(".cancel");

  modifyBtn.addEventListener("click", () => {
    originalComment.classList.add("hidden");
    modifyForm.classList.remove("hidden");
  });

  cancelBtn.addEventListener("click", () => {
    originalComment.classList.remove("hidden");
    modifyForm.classList.add("hidden");
  });
});
