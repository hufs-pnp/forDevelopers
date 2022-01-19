const data = document.querySelector(".pagination");

let {
  dataset: {
    numberofarticles: numberOfArticles,
    articlesperpage: articlesPerPage,
    currentpage: currentPage,
    shownbuttons: shownButtons,
    route,
    findterm: findTerm,
  },
} = data;

function showChangedArticles() {
  if (findTerm) {
    window.location.href = `/${route}/search/${currentPage}`;
  } else {
    window.location.href = `/${route}/${currentPage}`;
  }
}

function pagination() {
  const numberOfButtons = Math.ceil(numberOfArticles / articlesPerPage);

  const buttons = Array(numberOfButtons)
    .fill(1)
    .map((element, idx) => element + idx);
  const sideButtons =
    shownButtons / 2 == 0 ? shownButtons / 2 : (shownButtons - 1) / 2;

  function calculLeft(rest = 0) {
    return {
      array: buttons
        .slice(0, currentPage - 1)
        .reverse()
        .slice(0, sideButtons + rest)
        .reverse(),
      rest_length: function () {
        return sideButtons - this.array.length;
      },
    };
  }

  function calculRight(rest = 0) {
    return {
      array: buttons.slice(currentPage).slice(0, sideButtons + rest),
      rest_length: function () {
        return sideButtons - this.array.length;
      },
    };
  }

  const leftButtons = calculLeft(calculRight().rest_length()).array;
  const rightButtons = calculRight(calculLeft().rest_length()).array;

  let paginatedButtons = [
    ...leftButtons,
    parseInt(currentPage),
    ...rightButtons,
  ];

  // 맨 처음으로 가기
  if (paginatedButtons[0] != 1) {
    paginatedButtons = [1, "...", ...paginatedButtons];
  }
  // 맨 마지막으로 가기
  if (paginatedButtons[paginatedButtons.length - 1] != buttons.length) {
    paginatedButtons = [...paginatedButtons, "...", buttons.length];
  }

  const numbers = document.querySelector(".pagination .numbers");
  numbers.innerHTML = "";
  for (let i = 0; i < paginatedButtons.length; i++) {
    const button = document.createElement("button");

    button.innerText = paginatedButtons[i];

    if (currentPage == paginatedButtons[i]) {
      button.classList.add("active");
    }

    if (paginatedButtons[i] === "...") {
      button.classList.add("disabled");
    } else {
      button.addEventListener("click", () => {
        currentPage = paginatedButtons[i];
        showChangedArticles();
        pagination();
      });
    }

    numbers.appendChild(button);
  }
}

function clickPrev() {
  if (currentPage == 1) {
    return;
  }

  currentPage -= 1;
  showChangedArticles();
  pagination();
}

function clickNext() {
  const numberOfButtons = Math.ceil(numberOfArticles / articlesPerPage);

  if (currentPage == numberOfButtons) {
    return;
  }

  const number = parseInt(currentPage) + 1;
  currentPage = number;
  showChangedArticles();
  pagination();
}

const prev = document.querySelector(".pagination .prev");
const next = document.querySelector(".pagination .next");

if (numberOfArticles > 0) {
  pagination();
  prev.addEventListener("click", clickPrev);
  next.addEventListener("click", clickNext);
}
