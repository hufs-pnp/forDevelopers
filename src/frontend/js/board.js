/*************************
    게시물 작성 시간
*************************/
const timeForm = document.querySelectorAll(".board-form .info .time");

timeForm.forEach((element) => {
  const {
    dataset: { time },
  } = element;

  const day = element.querySelector(".day");
  const hours = element.querySelector(".hours");

  let totalTime = new Date(time);
  const year = totalTime.getFullYear() + "";
  const month = totalTime
    .toLocaleString("en", { month: "numeric" })
    .padStart(2, "0");
  const date = totalTime
    .toLocaleString("en", { day: "numeric" })
    .padStart(2, "0");
  let hour = totalTime
    .toLocaleString("en", { hour: "numeric", hour12: false })
    .padStart(2, "0");
  hour = hour == 24 ? "00" : hour;
  const minute = totalTime
    .toLocaleString("en", { minute: "numeric" })
    .padStart(2, "0");

  if (year == new Date().getFullYear()) {
    day.innerText = month + "/" + date;
    hours.innerText = hour + ":" + minute;
  } else {
    day.innerText = year + "/" + month + "/" + date;
    hours.innerText = hour + ":" + minute;
  }
});

/*************************
         찜 삭제
*************************/
const boardForm = document.querySelectorAll(".main .board-form");

boardForm.forEach((element) => {
  const deleteChoiceBtn = element.querySelector(".delete-btn span");

  if (!deleteChoiceBtn) return;

  const {
    dataset: { articleid: articleId, kinds },
  } = deleteChoiceBtn;

  deleteChoiceBtn.addEventListener("click", async (event) => {
    // anchor event 막기
    event.preventDefault();

    const response = await (
      await fetch(`/api/${kinds}/${articleId}/choice/delete`, {
        method: "POST",
      })
    ).json();

    switch (response.status) {
      case 200:
        window.location.reload();
        return;
      case 404:
        alert("에러가 발생했습니다.");
        window.location.href = "/";
        return;
    }
  });
});
