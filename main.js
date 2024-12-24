const toggleLoader = (status) => {
    if (status) {
        loading = true;
        loaderElement.style.display = "block";
    } else {
        loaderElement.style.display = "none";
        loading = false;
    }
};

// START - Search
searchInputDesktopElement.addEventListener("input", (e) => handleDisplaySearchResult(e.target.value.trim(), searchProductsResultDesktopElement));
searchInputDesktopElement.addEventListener("blur", (e) => handleSearchBlur(searchProductsResultDesktopElement));
searchInputMobileElement.addEventListener("input", (e) => handleDisplaySearchResult(e.target.value.trim(), searchProductsResultMobileElement));
searchInputMobileElement.addEventListener("blur", (e) => handleSearchBlur(searchProductsResultMobileElement));
// END - Search

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

// START - On Page Loads
const handleOnLoad = () => {
    toggleLoader(true);
    getProducts();
    getCategories();
    toggleLoader(false);
};
// END - On Page Loads

window.onload = handleOnLoad();
