const loaderElement = document.getElementById("loader");

const searchInputDesktopElement = document.getElementById("searchInputDesktop");
const searchProductsResultDesktopElement = document.getElementById("searchProductsResultDesktop");

const searchInputMobileElement = document.getElementById("searchInputMobile");
const searchProductsResultMobileElement = document.getElementById("searchProductsResultMobile");

const menuBtnElement = document.getElementById("menuBtn");
const menuElement = document.getElementById("menu");

const menuBtnMobile = document.getElementById("menuBtnMobile");
const cateogriesBtnMobile = document.getElementById("cateogriesBtnMobile");
const pagesMobileElement = document.getElementById("pagesMobile");
const categoriesMobileElement = document.getElementById("categoriesMobile");

const categoriesSliderElement = document.getElementById("categoriesSlider");

const featuredProductsElement = document.getElementById("featuredProducts");

const featuredCategoriesContainerElement = document.getElementById("featuredCategoriesContainer");

let loading = true;
let products = [];
let categories = [];
