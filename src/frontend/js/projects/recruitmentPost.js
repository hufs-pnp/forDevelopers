const addPostViews = () => {
  const postContainer = document.querySelector(".recruitmentPost-container");

  const {
    dataset: { id },
  } = postContainer;

  fetch(`/api/recruitments/${id}/views`, {
    method: "POST",
  });
};

addPostViews();
