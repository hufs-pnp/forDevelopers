/***********************
    menu 보여주기
***********************/
const openMenuBtn = document.querySelector(".open-menu");
const bgColor = document.querySelector(".route-container-bgColor");
const menuSection = document.querySelector(".route-container");
const closeMenuBtn = menuSection.querySelector(".close-menu");

openMenuBtn.addEventListener("click", () => {
  menuSection.style.transform = "translateX(-100%)";
  bgColor.classList.remove("hidden");
});
closeMenuBtn.addEventListener("click", () => {
  menuSection.removeAttribute("style");
  setTimeout(() => {
    bgColor.classList.add("hidden");
  }, 200);
});
