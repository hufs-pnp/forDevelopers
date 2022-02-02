/******************************
          웹메일 인증
******************************/
const email = document.querySelector(".email");
const emailInput = email.querySelector("input");
const emailBtn = email.querySelector(".check");

let verified = false;
emailBtn.addEventListener("click", async () => {
  if (emailInput.value == "") {
    alert("학교 웹메일을 입력해주세요.");
    return;
  }

  const response = await (
    await fetch("/api/email/auth/password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailInput.value }),
    })
  ).json();

  switch (response.status) {
    case 200:
      alert(`인증이 완료되었습니다.\n새로운 비밀번호를 적어주세요.`);
      verified = true;
      return;
    case 400:
      alert("학교 웹메일을 입력해주세요.");
      return;
    case 401:
      alert("가입되지 않은 이메일입니다.");
      emailInput.value = "";
      return;
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
      return;
  }
});

emailInput.addEventListener("keyup", () => {
  verified = false;
});

/******************************
          form 확인
******************************/
const form = document.querySelector(".findPassword-container form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (verified) {
    return form.submit();
  } else {
    return alert("이메일 확인을 눌러주세요.");
  }
});
