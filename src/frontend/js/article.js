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
  dataset: { posttimedata: postTimeData },
} = postTime;

getTime(
  postTimeData,
  postTime.querySelector(".day"),
  postTime.querySelector(".hours")
);

/*************************
     댓글 작성 시간
*************************/
const commentTime = document.querySelectorAll(
  ".comment-lists .comment-box .comment-user .second-column .time"
);

commentTime.forEach((time) => {
  const {
    dataset: { commenttimedata: commentTimeData },
  } = time;

  getTime(
    commentTimeData,
    time.querySelector(".day"),
    time.querySelector(".hours")
  );
});

/*************************************
     좋아요, 찜, 조회수, 댓글 공통
*************************************/
const icons = document.querySelector(".icons");
const {
  dataset: { kinds, articleid: articleId, login },
} = icons;

/*************************
      게시글 좋아요
*************************/
const like = icons.querySelector(".like");

like.addEventListener("click", async () => {
  if (login === undefined) {
    alert("로그인 후 이용 가능합니다.");
    return;
  }

  const response = await (
    await fetch(`/api/${kinds}/${articleId}/like`, {
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
            찜 
*************************/
const choice = icons.querySelector(".choice");

choice.addEventListener("click", async () => {
  if (login === undefined) {
    alert("로그인 후 이용 가능합니다.");
    return;
  }

  const response = await (
    await fetch(`/api/${kinds}/${articleId}/choice`, {
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
    await fetch(`/api/${kinds}/${articleId}/views`, {
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
        댓글 좋아요 
*************************/
const commentLikes = document.querySelectorAll(
  ".comment-lists .comment-box .comment-options .comment-like-btn"
);

commentLikes.forEach((like) => {
  const {
    dataset: {
      commentid: commentId,
      numberofcommentlike: numberOfCommentLike,
      login,
    },
  } = like;

  // 좋아요가 1개 이상이면
  if (numberOfCommentLike > 0) {
    like.previousElementSibling.classList.remove("hidden");
  }

  like.addEventListener("click", async () => {
    // 로그인 안했으면
    if (login == undefined) {
      alert("로그인 후 이용 가능합니다.");
      return;
    }

    const response = await (
      await fetch(`/api/${kinds}/${articleId}/comment/${commentId}/like`, {
        method: "POST",
      })
    ).json();

    switch (response.status) {
      case 200:
        const likeIcon = like.previousElementSibling;
        const count = likeIcon.children[1];
        likeIcon.classList.remove("hidden");
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

  const modifiedInput = modifyForm.querySelector("input");
  const submitBtn = modifyForm.querySelector(".modify");
  const cancelBtn = modifyForm.querySelector(".cancel");

  const {
    dataset: { commentid: commentId },
  } = submitBtn;

  // Enter event 막기
  modifyForm.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
    }
  });

  // 댓글 작성자와 로그인한 유저가 같은 경우
  if (modifyBtn) {
    modifyBtn.addEventListener("click", () => {
      originalComment.classList.add("hidden");
      modifyForm.classList.remove("hidden");
      modifyForm.querySelector("input").focus();
    });
  }

  cancelBtn.addEventListener("click", () => {
    originalComment.classList.remove("hidden");
    modifyForm.classList.add("hidden");
  });

  submitBtn.addEventListener("click", async () => {
    const response = await (
      await fetch(`/categories/comment/${commentId}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: modifiedInput.value }),
      })
    ).json();

    switch (response.status) {
      case 200:
        originalComment.innerText = response.value;
        break;
      case 404:
        alert("에러가 발생했습니다.");
        window.location.href = "/";
        break;
    }

    originalComment.classList.remove("hidden");
    modifyForm.classList.add("hidden");
  });
});

/*************************
        탈퇴 인원
*************************/
const user = document.querySelector(".main .user");
const commentUserLists = document.querySelectorAll(
  ".comment-lists .comment-box .comment-user"
);

if (!user.dataset.existence) {
  user.classList.add("inactive");
}

commentUserLists.forEach((element) => {
  if (!element.dataset.existence) {
    element.classList.add("inactive");
  }
});
