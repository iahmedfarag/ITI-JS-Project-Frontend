const loaderElement = document.getElementById("loader");

const searchInputDesktopElement = document.getElementById("searchInputDesktop");
const searchProductsResultDesktopElement = document.getElementById("searchProductsResultDesktop");

const searchInputMobileElement = document.getElementById("searchInputMobile");
const searchProductsResultMobileElement = document.getElementById("searchProductsResultMobile");

const menuBtnElement = document.getElementById("menuBtn");
const menuElement = document.getElementById("menu");

let loading = true;
let products = [];
let categories = [];
