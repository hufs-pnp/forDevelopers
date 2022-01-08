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

const addViews = async () => {
  const {
    dataset: { id },
  } = postContainer;

  const response = await (
    await fetch(`/api/${category}/${id}/views`, {
      method: "POST",
    })
  ).json();

  switch (response.status) {
    case 404:
      alert("에러가 발생했습니다.");
      window.location.href = "/";
      return;
  }
};

addViews();
