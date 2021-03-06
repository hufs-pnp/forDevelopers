import "regenerator-runtime";

/**********************************************
   학교 웹메일로 로그인 안 했을 때 에러 메세지
**********************************************/
const errorMessage = document.querySelector(".errorMessage");

const {
  dataset: { snsloginerror: snsLoginError },
} = errorMessage;

if (snsLoginError.length > 2) {
  const msg = snsLoginError.substr(1, snsLoginError.length - 2);
  alert(msg);
  window.location.href = "/users/login";
}

/*************************************
    로그인 버튼 눌렀을 때 체크 사항
*************************************/
const email = document.querySelector(".email");
const emailInput = email.querySelector(".inputBox input");
const password = document.querySelector(".password");
const passwordInput = password.querySelector(".inputBox input");
const loginBtn = document.querySelector("form .inputBox .submit");

function showError(element, msg) {
  element.querySelector(".inputBox").classList.add("error", "animate");
  element.querySelector(".err-icon").classList.remove("error");
  element.querySelector(".text").classList.add("active");
  element.querySelector(".text.active").innerText = msg;

  setTimeout(() => {
    element.querySelector(".inputBox").classList.remove("animate");
  }, 320);
}

function removeError(element) {
  element.querySelector(".inputBox").classList.remove("error");
  element.querySelector(".err-icon").classList.add("error");
  element.querySelector(".text").classList.remove("active");
}

loginBtn.addEventListener("click", async () => {
  let emailFlag = true;
  let passwordFlag = true;

  // !emailInput.value.includes("@hufs.ac.kr")
  if (emailInput.value == "") {
    // showError(email, "학교 웹메일을 입력해주세요.");
    showError(email, "이메일을 입력해주세요.");
    emailFlag = false;
  }
  if (passwordInput.value == "") {
    showError(password, "비밀번호를 입력해주세요.");
    passwordFlag = false;
  }

  if (!emailFlag || !passwordFlag) {
    return;
  }

  const response = await (
    await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailInput.value,
        password: passwordInput.value,
      }),
    })
  ).json();

  switch (response.status) {
    case 200:
      window.location.href = "/";
      return;
    case 400:
      alert("계정이 없습니다.");
      return;
    case 401:
      alert("비밀번호가 다릅니다.");
      return;
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
      return;
  }
});

emailInput.addEventListener("keyup", () => {
  // emailInput.value.includes("@hufs.ac.kr")
  if (emailInput.value.includes("@")) {
    removeError(email);
  }
});

passwordInput.addEventListener("keyup", () => {
  if (password.value != "") {
    removeError(password);
  }
});
