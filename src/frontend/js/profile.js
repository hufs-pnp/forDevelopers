/************************
    github url 처리
************************/
const wrapper = document.querySelector(".first-column .wrapper:last-child");

const {
  dataset: { githuburl: github_url },
} = wrapper;

if (github_url.startsWith("Write")) {
  const span = document.createElement("span");
  span.innerText = github_url;
  wrapper.appendChild(span);
} else {
  const a = document.createElement("a");
  a.href = github_url;
  a.innerText = "visit github";
  wrapper.appendChild(a);
}

/************************
      학과 처리
************************/
const firstRowDepartment = document.querySelector(
  ".hidden-column .first-row span:nth-child(2)"
);

const {
  dataset: { department },
} = firstRowDepartment;

if (department == "") {
  const strong = document.createElement("strong");
  strong.innerText = "Write your department";
  firstRowDepartment.appendChild(strong);
} else {
  const strong = document.createElement("strong");
  strong.innerText = department;
  firstRowDepartment.appendChild(strong);
}

/************************
      관심 분야 처리
************************/
const firstRowInterest = document.querySelector(
  ".hidden-column .first-row span:last-child"
);

const {
  dataset: { interest },
} = firstRowInterest;

if (interest.length == 2) {
  const strong = document.createElement("strong");
  strong.innerText = "Write your interests";
  firstRowInterest.appendChild(strong);
} else {
  const strong = document.createElement("strong");
  strong.innerText = interest.substr(2, interest.length - 4);
  firstRowInterest.appendChild(strong);
}

/*******************************************
        hover시에 profile 정보 보여주기
*******************************************/
const profileContainer = document.querySelector(".profile-container");
const hiddenColumn = document.querySelector(".hidden-column");

profileContainer.addEventListener("mouseenter", () => {
  hiddenColumn.classList.add("show");
});

profileContainer.addEventListener("mouseleave", () => {
  hiddenColumn.classList.remove("show");
});
