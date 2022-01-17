/*************************
    게시물 작성 시간
*************************/
const timeForm = document.querySelectorAll(".board-form .info .time");

timeForm.forEach((element) => {
  const {
    dataset: { time },
  } = element;

  let totalTime = new Date(time);
  const year = totalTime.getFullYear() + "";
  const month = totalTime
    .toLocaleString("en", { month: "numeric" })
    .padStart(2, "0");
  const date = totalTime
    .toLocaleString("en", { day: "numeric" })
    .padStart(2, "0");
  const hour = totalTime
    .toLocaleString("en", { hour: "numeric", hour12: false })
    .padStart(2, "0");
  const minute = totalTime
    .toLocaleString("en", { minute: "numeric" })
    .padStart(2, "0");

  if (year == new Date().getFullYear()) {
    totalTime = month + "/" + date + " " + hour + ":" + minute;
  } else {
    totalTime = year + "/" + month + "/" + date + " " + hour + ":" + minute;
  }

  element.innerText = totalTime;
});
