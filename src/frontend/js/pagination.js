const data = document.querySelector(".pagination");

let {
  dataset: {
    numberofarticles: numberOfArticles,
    articlesperpage: articlesPerPage,
    currentpage: currentPage,
    shownbuttons: shownButtons,
    category,
    searchterm: searchTerm,
  },
} = data;

async function showChangedArticles() {
  if (searchTerm) {
    document.location.href = `/${category}/search/${currentPage}?searchTerm=${searchTerm}`;
  } else {
    document.location.href = `/${category}/${currentPage}`;
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
      currentPage = paginatedButtons[i];
      showChangedArticles();
      pagination();
    });

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

prev.addEventListener("click", clickPrev);
next.addEventListener("click", clickNext);

pagination();
