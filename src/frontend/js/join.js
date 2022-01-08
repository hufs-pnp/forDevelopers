import "regenerator-runtime";

function showError(label, input, element, msg) {
  label.classList.add("red");
  input.classList.add("error");
  label.querySelector("i").classList.remove("error");
  element.querySelector(".text").classList.add("active");
  element.querySelector(".text.active").innerText = msg;
}

function removeError(label, input, element) {
  label.classList.remove("red");
  input.classList.remove("error");
  label.querySelector("i").classList.add("error");
  element.querySelector(".text").classList.remove("active");
}

/******************************
      닉네임 중복 확인
******************************/
const nickname = document.querySelector(".nickname");
const nicknameLabel = nickname.querySelector("label");
const nicknameInput = nickname.querySelector("input");
const nicknameBtn = nickname.querySelector(".check");

nicknameBtn.addEventListener("click", async () => {
  if (nicknameInput.value == "") {
    showError(nicknameLabel, nicknameInput, nickname, "닉네임을 입력해주세요.");
    return;
  }

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
      removeError(nicknameLabel, nicknameInput, nickname);
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
  removeError(nicknameLabel, nicknameInput, nickname);
});

/******************************
          웹메일 인증
******************************/
const email = document.querySelector(".email");
const emailLabel = email.querySelector("label");
const emailInput = email.querySelector("input");
const emailBtn = email.querySelector(".check");

emailBtn.addEventListener("click", async () => {
  if (emailInput.value == "") {
    showError(emailLabel, emailInput, email, "학교 웹메일을 입력해주세요.");
    return;
  }

  const response = await (
    await fetch("/api/email/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: emailInput.value }),
    })
  ).json();

  switch (response.status) {
    case 200:
      alert(`입력하신 메일로 인증코드를 보냈습니다.\n인증코드를 입력해주세요.`);
      return;
    case 400:
      showError(emailLabel, emailInput, email, "학교 웹메일을 입력해주세요.");
      return;
    case 401:
      alert("가입된 계정이 있습니다.");
      window.location.href = "/users/login";
      return;
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
      return;
  }
});

emailInput.addEventListener("keyup", () => {
  removeError(emailLabel, emailInput, email);
});

/******************************
        인증코드 확인
******************************/
const code = document.querySelector(".code");
const codeLabel = code.querySelector("label");
const codeInput = code.querySelector("input");
const codeBtn = code.querySelector(".check");

codeBtn.addEventListener("click", async () => {
  if (codeInput.value == "") {
    showError(codeLabel, codeInput, code, "인증코드를 입력해주세요.");
    return;
  }

  const response = await (
    await fetch("/api/code/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code: codeInput.value }),
    })
  ).json();

  switch (response.status) {
    case 200:
      alert("인증을 성공하였습니다.");
      codeBtn.classList.add("verified");
      removeError(codeLabel, codeInput, code);
      return;
    case 400:
      codeBtn.classList.remove("verified");
      showError(codeLabel, codeInput, code, "잘못된 인증코드입니다.");
      return;
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
      return;
  }
});

codeInput.addEventListener("keyup", () => {
  codeBtn.classList.remove("verified");
  removeError(codeLabel, codeInput, code);
});

/***************************************
      next, previous, submit 버튼
                &
        기입 필수 요소 확인
***************************************/
const page = document.querySelector(".page");
const form = document.querySelector("form");
const next_1Btn = document.querySelector(".next-1");
const next_2Btn = document.querySelector(".next-2");
const prevBtn = document.querySelectorAll(".btn .prev");
const submitBtn = document.querySelector(".btn .submit");

const name = document.querySelector(".name");
const nameInput = name.querySelector("input");
const nameLabel = name.querySelector("label");

const password = document.querySelector(".password");
const passwordInput = password.querySelector("input");
const passwordLabel = password.querySelector("label");

const steps = document.querySelectorAll(".progress-bar .step");

let currentPage = 1;

function handleNext() {
  steps[currentPage - 1].classList.add("active");

  currentPage += 1;

  let multiple = null;
  switch (currentPage) {
    case 2:
      multiple = 1;
      break;
    case 3:
      multiple = 2;
  }

  form.style.marginLeft = `-${page.offsetWidth * multiple}px`;
}

function handlePrev() {
  steps[currentPage - 2].classList.remove("active");

  currentPage -= 1;

  let multiple = null;
  switch (currentPage) {
    case 1:
      multiple = 0;
      break;
    case 2:
      multiple = 1;
  }

  form.style.marginLeft = `-${page.offsetWidth * multiple}px`;
}

function handleSubmit() {
  steps[steps.length - 1].classList.add("active");

  setTimeout(() => {
    alert("회원가입이 완료되었습니다!");
    document.querySelector("form").submit();
  }, 250);
}

next_1Btn.addEventListener("click", () => {
  // 모든 조건 충족되면 true
  let nameFlag = true;
  let nicknameFlag = true;

  // 이름을 안 적은 경우
  if (nameInput.value == "") {
    nameFlag = false;
    showError(nameLabel, nameInput, name, "이름을 입력해주세요.");

    nameInput.addEventListener("keyup", () => {
      if (nameInput.value != "") {
        nameFlag = true;
        removeError(nameLabel, nameInput, name);
      } else {
        nameFlag = false;
        showError(nameLabel, nameInput, name, "이름을 입력해주세요.");
      }
    });
  }

  // 닉네임을 중복 확인 안한 경우
  if (!nicknameBtn.classList.contains("verified")) {
    nicknameFlag = false;
    let message = null;

    if (nicknameInput.value == "") {
      message = "닉네임을 입력해주세요.";
    } else {
      message = "중복 확인 해주세요.";
    }

    showError(nicknameLabel, nicknameInput, nickname, message);
  } else {
    nicknameFlag = true;
    removeError(nicknameLabel, nicknameInput, nickname);
  }

  if (nameFlag && nicknameFlag) {
    handleNext();
  }
});

next_2Btn.addEventListener("click", () => {
  let emailFlag = true;
  let codeFlag = true;
  let passwordFlag = true;

  // 학교 웹메일 안 적은 경우
  if (emailInput.value == "") {
    emailFlag = false;
    showError(emailLabel, emailInput, email, "학교 웹메일을 입력해주세요.");

    emailInput.addEventListener("keyup", () => {
      if (emailInput.value.includes("@hufs.ac.kr")) {
        emailFlag = true;
        removeError(emailLabel, emailInput, email);
      } else {
        emailFlag = false;
        showError(emailLabel, emailInput, email, "학교 웹메일을 입력해주세요.");
      }
    });
  }

  // 인증코드를 틀린 경우
  if (!codeBtn.classList.contains("verified")) {
    codeFlag = false;
    let message = null;

    if (codeInput.value == "") {
      message = "인증코드를 입력해주세요.";
    } else {
      message = "인증코드를 확인해주세요.";
    }

    showError(codeLabel, codeInput, code, message);
  } else {
    codeFlag = true;
    removeError(codeLabel, codeInput, code);
  }

  // 비밀번호를 안 적은 경우
  if (passwordInput.value == "") {
    passwordFlag = false;
    showError(
      passwordLabel,
      passwordInput,
      password,
      "패스워드를 입력해주세요."
    );

    passwordInput.addEventListener("keyup", () => {
      if (passwordInput.value != "") {
        passwordFlag = true;
        removeError(passwordLabel, passwordInput, password);
      } else {
        passwordFlag = false;
        showError(
          passwordLabel,
          passwordInput,
          password,
          "패스워드를 입력해주세요."
        );
      }
    });
  }

  if (emailFlag && codeFlag && passwordFlag) {
    handleNext();
  }
});

prevBtn.forEach((btn) => {
  btn.addEventListener("click", handlePrev);
});

submitBtn.addEventListener("click", handleSubmit);

/**********************************************
          submit error 처리
**********************************************/
const errorMessage = document.querySelector(".errorMessage");

const {
  dataset: { joinerrormsg: joinErrorMsg },
} = errorMessage;

if (joinErrorMsg.length > 2) {
  const msg = joinErrorMsg.substr(1, joinErrorMsg.length - 2);
  alert(msg);
  window.location.href = "/users/join";
}

/******************************
      패스워드 보안 체크
******************************/
const passwordSecure = document.querySelector(".password .passwordSecure");
const indicator = document.querySelector(".password .indicator");

const weak = indicator.querySelector(".weak");
const weakRegex = /[a-z]/; // 알파벳

const medium = indicator.querySelector(".medium");
const mediumRegex = /\d+/; // 숫자

const strong = indicator.querySelector(".strong");
const strongRegex = /[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/; // 특수문자

passwordInput.addEventListener("keyup", () => {
  const value = passwordInput.value;

  if (value.length != 0) {
    indicator.classList.add("active");

    // weak
    if (value.length <= 6) {
      weak.classList.add("active");
      passwordSecure.style.color = "#ff4747";
      passwordSecure.innerText = "약함";
    }

    // medium
    if (
      value.length > 6 &&
      ((value.match(weakRegex) && value.match(mediumRegex)) ||
        (value.match(weakRegex) && value.match(strongRegex)) ||
        (value.match(mediumRegex) && value.match(strongRegex)))
    ) {
      medium.classList.add("active");
      passwordSecure.style.color = "orange";
      passwordSecure.innerText = "중간";
    } else {
      medium.classList.remove("active");
    }

    // strong
    if (
      value.length > 10 &&
      value.match(weakRegex) &&
      value.match(mediumRegex) &&
      value.match(strongRegex)
    ) {
      strong.classList.add("active");
      passwordSecure.style.color = "#23ad5c";
      passwordSecure.innerText = "강함";
    } else {
      strong.classList.remove("active");
    }
  } else {
    indicator.classList.remove("active");
    passwordSecure.removeAttribute("style");
    passwordSecure.innerText = "";
  }
});

/******************************
      Enter event 막기
******************************/
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
  }
});
