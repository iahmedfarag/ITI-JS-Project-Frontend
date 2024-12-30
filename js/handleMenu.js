import { categoriesMobileElement, cateogriesBtnMobile, menuBtnElement, menuBtnMobile, menuElement, pagesMobileElement } from "./variables.js";

// START - Menu
const toggleMenu = () => {
    menuElement.classList.toggle("menu-open");
    if (menuElement.classList.contains("menu-open")) {
        menuBtnElement.innerHTML = `<i class="fa-solid fa-x"></i>`;
    } else {
        menuBtnElement.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    }
};

document.addEventListener("click", (e) => {
    if (menuBtnElement.contains(e.target)) {
        toggleMenu();
        return;
    }
    if (!menuElement.contains(e.target) && menuElement.classList.contains("menu-open")) {
        menuElement.classList.remove("menu-open");
        menuBtnElement.innerHTML = `<i class="fa-solid fa-bars"></i>`;
    }
});

// END - Menu

menuBtnMobile.addEventListener("click", () => {
    pagesMobileElement.style.display = "flex";
    categoriesMobileElement.style.display = "none";
    menuBtnMobile.classList.toggle("active");
    cateogriesBtnMobile.classList.toggle("active");
});

cateogriesBtnMobile.addEventListener("click", () => {
    pagesMobileElement.style.display = "none";
    categoriesMobileElement.style.display = "flex";
    menuBtnMobile.classList.toggle("active");
    cateogriesBtnMobile.classList.toggle("active");
});
