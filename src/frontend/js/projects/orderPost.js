const addPostViews = () => {
  const postContainer = document.querySelector(".orderPost-container");

  const {
    dataset: { id },
  } = postContainer;

  fetch(`/api/orders/${id}/views`, {
    method: "POST",
  });
};

addPostViews();
