const addPostViews = () => {
  const postContainer = document.querySelector(".communityPost-container");

  const {
    dataset: { id },
  } = postContainer;

  fetch(`/api/communities/${id}/views`, {
    method: "POST",
  });
};

addPostViews();
