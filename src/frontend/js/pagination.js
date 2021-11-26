const data = document.querySelector(".pagination");

const {
  dataset: {
    numberofarticles: numberOfArticles,
    articlesperpage: articlesPerPage,
    currentpage: currentPage,
    shownbuttons: shownButtons,
    category,
  },
} = data;

const params = {
  numberOfArticles,
  articlesPerPage,
  currentPage,
  shownButtons,
  category,
};

async function showChangedArticles(params) {
  const { currentPage, category } = params;

  document.location.href = `/${category}/${currentPage}`;
}

function pagination(params) {
  const { numberOfArticles, articlesPerPage, currentPage, shownButtons } =
    params;
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

  const paginatedButtons = [
    ...leftButtons,
    parseInt(currentPage),
    ...rightButtons,
  ];

  const numbers = document.querySelector(".pagination .numbers");
  numbers.innerHTML = "";
  for (let i = 0; i < paginatedButtons.length; i++) {
    const button = document.createElement("button");

    button.innerText = paginatedButtons[i];

    if (currentPage == paginatedButtons[i]) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      params.currentPage = paginatedButtons[i];
      showChangedArticles(params);
      pagination(params);
    });

    numbers.appendChild(button);
  }
}

function clickPrev() {
  const { currentPage } = params;

  if (currentPage == 1) {
    return;
  }

  params.currentPage -= 1;
  showChangedArticles(params);
  pagination(params);
}

function clickNext() {
  const { numberOfArticles, articlesPerPage, currentPage } = params;

  const numberOfButtons = Math.ceil(numberOfArticles / articlesPerPage);

  if (currentPage == numberOfButtons) {
    return;
  }

  const number = parseInt(params.currentPage) + 1;
  params.currentPage = number;
  showChangedArticles(params);
  pagination(params);
}

const prev = document.querySelector(".pagination .prev");
const next = document.querySelector(".pagination .next");

prev.addEventListener("click", clickPrev);
next.addEventListener("click", clickNext);

pagination(params);
