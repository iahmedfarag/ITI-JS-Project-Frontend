import { handleLogout, toggleAuthLinks } from "./js/generalFunctions.js";
import { handleDisplaySearchResult, handleSearchBlur } from "./js/handleSearch.js";
import { logoutButton, searchInputDesktopElement, searchInputMobileElement, searchProductsResultDesktopElement, searchProductsResultMobileElement } from "./js/variables.js";

// Event listener for DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
    toggleAuthLinks();

    // Add event listener to logout button
    logoutButton.addEventListener("click", handleLogout);

    // Add event listeners for search inputs
    searchInputDesktopElement.addEventListener("input", (e) => handleDisplaySearchResult(e.target.value.trim(), searchProductsResultDesktopElement));
    searchInputDesktopElement.addEventListener("blur", () => handleSearchBlur(searchProductsResultDesktopElement));
    searchInputMobileElement.addEventListener("input", (e) => handleDisplaySearchResult(e.target.value.trim(), searchProductsResultMobileElement));
    searchInputMobileElement.addEventListener("blur", () => handleSearchBlur(searchProductsResultMobileElement));
});
