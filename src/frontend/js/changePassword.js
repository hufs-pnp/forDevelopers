import "regenerator-runtime";

/**********************************
     현재 비밀번호 맞는지 확인
**********************************/
const form = document.querySelector("form");
const currentPassword = form.querySelector("form input:first-child");
const newPassword = form.querySelector("form input:nth-child(2)");

const {
  dataset: { id },
} = form;

form.addEventListener("submit", async () => {
  const response = await (
    await fetch(`/users/${id}/password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        current_password: currentPassword.value,
        new_password: newPassword.value,
      }),
    })
  ).json();

  switch (response.status) {
    case 200:
      alert("변경이 완료되었습니다.");
      window.location.href = `/users/${id}`;
      return;
    case 400:
      alert("현재 비밀번호가 다릅니다.");
      window.location.href = `/users/${id}/password`;
      return;
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
      return;
  }
});
