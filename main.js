const toggleLoader = (status) => {
    if (status) {
        loading = true;
        loaderElement.style.display = "block";
    } else {
        loaderElement.style.display = "none";
        loading = false;
    }
};

searchInputDesktopElement.addEventListener("input", (e) => handleDisplaySearchResult(e.target.value.trim(), searchProductsResultDesktopElement));
searchInputDesktopElement.addEventListener("blur", (e) => handleSearchBlur(searchProductsResultDesktopElement));
searchInputMobileElement.addEventListener("input", (e) => handleDisplaySearchResult(e.target.value.trim(), searchProductsResultMobileElement));
searchInputMobileElement.addEventListener("blur", (e) => handleSearchBlur(searchProductsResultMobileElement));

const handleOnLoad = () => {
    toggleLoader(true);
    getProducts();
    getCategories();
    toggleLoader(false);
};

window.addEventListener("load", () => {
    handleOnLoad();
});
