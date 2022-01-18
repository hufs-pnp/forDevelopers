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
