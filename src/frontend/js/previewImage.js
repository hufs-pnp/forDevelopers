const profile = document.querySelector(
  ".profileUpdate-container input[type='file']"
);
const image = document.querySelector(".profileUpdate-container img");

function previewImage() {
  const reader = new FileReader();
  reader.readAsDataURL(profile.files[0]);
  reader.addEventListener("loadend", (event) => {
    image.src = event.target.result;
  });
}

profile.addEventListener("change", previewImage);
