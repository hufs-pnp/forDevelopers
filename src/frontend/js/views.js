let postContainer = null;
let category = null;

if ((temp = document.querySelector(".recruitmentArticle-container"))) {
  postContainer = temp;
  category = "recruitments";
} else if ((temp = document.querySelector(".orderArticle-container"))) {
  postContainer = temp;
  category = "orders";
} else if ((temp = document.querySelector(".communityArticle-container"))) {
  postContainer = temp;
  category = "communities";
}

const addViews = () => {
  const {
    dataset: { id },
  } = postContainer;

  fetch(`/api/${category}/${id}/views`, {
    method: "POST",
  });
};

addViews();
