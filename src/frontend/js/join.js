import "regenerator-runtime";

const email = document.querySelector(".email");
const input = email.querySelector("input");
const button = email.querySelector("button");

button.addEventListener("click", async () => {
  if (input.value == "") {
    alert("이메일을 입력해주세요.");
    return;
  }

  const response = await fetch("/api/email/auth", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: input.value }),
  });

  if (response.status == 400) {
    alert("네이버나 구글 이메일을 적어주세요.");
    return;
  }

  alert(`귀하의 메일로 인증 코드를 보냈습니다.\n인증코드를 적어주세요.`);
});
