import { handleLogout, toggleAuthLinks, toggleLoader, updateCartQuantity } from "../../js/generalFunctions.js";
import { logoutButton } from "../../js/variables.js";
logoutButton.addEventListener("click", handleLogout);
toggleAuthLinks();
updateCartQuantity();
const resizeButtonlist = document.getElementById("resizeButtonlist");
const resizeButton2 = document.getElementById("resizeButton2");
const resizeButton3 = document.getElementById("resizeButton3");
const resizeButton4 = document.getElementById("resizeButton4");
const imgElements = document.querySelectorAll(".col-md-4 img");
const buttons = [resizeButton2, resizeButton3, resizeButton4];
let allProducts = [];
var filteredResponseByPrice = [];
var lengthOfFilteredResponseByPrice;
var filteredResponseByCategory = [];
var lengthOfFilteredResponseByCategory;
function resetFillColors() {
    buttons.forEach((btn) => {
        btn.setAttribute("fill", "#B0B0B0");
    });
}
resizeButton2.addEventListener("click", () => {
    resetFillColors();
    resizeButton2.setAttribute("fill", "#000000");
    const cards = Array.from(document.querySelectorAll(".col-md-4"));
    cards.map((card) => {
        card.style.width = "50%";
    });
});
resizeButton3.addEventListener("click", () => {
    resetFillColors();
    resizeButton3.setAttribute("fill", "#000000");
    const cards = Array.from(document.querySelectorAll(".col-md-4"));
    cards.map((card) => {
        card.style.width = "33.3333%";
    });
});
resizeButton4.addEventListener("click", () => {
    resetFillColors();
    resizeButton4.setAttribute("fill", "#000000");
    const cards = Array.from(document.querySelectorAll(".col-md-4"));
    cards.map((card) => {
        card.style.width = "25%";
    });
});

fetch(`https://iti-js-project-backend.vercel.app/api/products/`)
    .then((response) => response.json())
    .then((response) => {
        allProducts = response;
        var cartona = "";
        for (var i = 0; i < response.length; i++) {
            cartona += `<div class="col-md-4">
                <div class="card" onclick="location.href='../singleProduct/singleProduct.html?id=${response[i]._id}'" >
                    <img id="img-${i}" class="card-img-top" src="${response[i].mainImage}" alt="Card image" />
                    <div class="card-body">
                        <a class="text-center my-1">${response[i].name}</a>
                        <p class="cat text-center">${response[i].category.name}</p>
                        <p class="price text-center">${response[i].price}$</p>
                    </div>
                </div>
            </div>`;
        }
        document.getElementById("myData").innerHTML = cartona;
        response.forEach((product, index) => {
            const hoverImg = document.getElementById(`img-${index}`);
            hoverImg.addEventListener("mouseenter", () => {
                hoverImg.src = product.otherImages[0];
            });
            hoverImg.addEventListener("mouseleave", () => {
                hoverImg.src = product.mainImage;
            });
        });
        var price = response.map((product) => product.price);
        price.sort((a, b) => a - b);
        const minPriceValue = price[0];
        const maxPriceValue = price[price.length - 1];
        const minPriceInput = document.getElementById("minPrice");
        const maxPriceInput = document.getElementById("maxPrice");
        const minValueDisplay = document.getElementById("minValue");
        const maxValueDisplay = document.getElementById("maxValue");
        minPriceInput.min = minPriceValue;
        minPriceInput.max = maxPriceValue;
        minPriceInput.value = minPriceValue;
        maxPriceInput.min = minPriceValue;
        maxPriceInput.max = maxPriceValue;
        maxPriceInput.value = maxPriceValue;
        minValueDisplay.textContent = minPriceValue;
        maxValueDisplay.textContent = maxPriceValue;
        function updatePriceRange() {
            let minPrice = parseInt(minPriceInput.value);
            let maxPrice = parseInt(maxPriceInput.value);
            if (minPrice > maxPrice) {
                maxPriceInput.value = minPrice;
                maxPrice = minPrice;
            }
            minValueDisplay.textContent = minPrice;
            maxValueDisplay.textContent = maxPrice;
        }
        minPriceInput.addEventListener("input", updatePriceRange);
        maxPriceInput.addEventListener("input", updatePriceRange);
        document.getElementById("filterBtn").addEventListener("click", () => {
            const minPriceSelected = parseInt(minPriceInput.value);
            const maxPriceSelected = parseInt(maxPriceInput.value);
            filteredResponseByPrice = response.filter((product) => product.price >= minPriceSelected && product.price <= maxPriceSelected);
            lengthOfFilteredResponseByPrice = filteredResponseByPrice.length;
            console.log(lengthOfFilteredResponseByPrice);
            let filteredCartona = "";
            filteredResponseByPrice.forEach((product, index) => {
                filteredCartona += `<div class="col-md-4">
                    <div class="card" onclick="location.href='singleProduct.html?id=${product._id}'" >
                        <img id="filtered-img-${index}" class="card-img-top" src="${product.mainImage}" alt="Card image" />
                        <div class="card-body">
                            <p class="my-1">${product.name}</p>
                            <p class="">${product.category.name}</p>
                            <p class="price">${product.price}$</p>
                        </div>
                    </div>
                </div>`;
            });
            document.getElementById("myData").innerHTML = filteredCartona;
            filteredResponseByPrice.forEach((product, index) => {
                const hoverImg = document.getElementById(`filtered-img-${index}`);
                hoverImg.addEventListener("mouseenter", () => {
                    hoverImg.src = product.otherImages[1];
                    hoverImg.style.transform = "scale(1.1)";
                    hoverImg.style.transition = "transform 0.3s ease";
                });
                hoverImg.addEventListener("mouseleave", () => {
                    hoverImg.src = product.mainImage;
                    hoverImg.style.transform = "scale(1)";
                });
            });
        });
    })
    .catch((error) => console.error("Error fetching products:", error));

var total = [];
fetch(`https://iti-js-project-backend.vercel.app/api/categories`)
    .then((response) => response.json())
    .then((response2) => {
        var categories = [];
        var categoryIds = [];
        for (let i = 0; i < response2.length; i++) {
            categories.push(response2[i].name);
            total.push(response2[i].products.length);
            categoryIds.push(response2[i]._id);
        }
        var cartonaa = "";
        for (let i = 0; i < categories.length; i++) {
            if (total[i] > 0) {
                cartonaa += `
                    <button class="filterCategory" data-category-id="${categoryIds[i]}">
                        <div style=" display: flex; justify-content: space-between; align-items: center;">
                            <span class="categoryText">${categories[i]}</span>
                            <span class="numOfItems">${total[i]}</span>
                        </div>
                    </button>
                `;
            }
        }
        document.getElementById("filterCategory").innerHTML = cartonaa;
        const categoryButtons = document.querySelectorAll(".filterCategory");
        categoryButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const categoryId = button.getAttribute("data-category-id");
                filterProductsByCategory(categoryId);
            });
        });
    })
    .catch((error) => console.error("Error fetching categories:", error));

function filterProductsByCategory(categoryId, products) {
    filteredResponseByCategory = allProducts.filter((product) => product.category._id === categoryId);
    let filteredCartona = ``;
    filteredResponseByCategory.forEach((product, index) => {
        filteredCartona += `<div class="col-md-4">
            <div class="card" onclick="location.href='singleProduct.html?id=${product._id}'" >
                <img id="img-${index}" class="card-img-top" src="${product.mainImage}" alt="Card image" />
                <div class="card-body">
                    <p class="my-1">${product.name}</p>
                    <p class="">${product.category.name}</p>
                    <p class="price">${product.price}$</p>
                </div>
            </div>
        </div>`;
    });

    document.getElementById("myData").innerHTML = filteredCartona;
    filteredResponseByCategory.forEach((product, index) => {
        const hoverImg = document.getElementById(`img-${index}`);
        hoverImg.addEventListener("mouseenter", () => {
            hoverImg.src = product.otherImages[0];
        });
        hoverImg.addEventListener("mouseleave", () => {
            hoverImg.src = product.mainImage;
        });
    });
}

document.getElementById("cars").addEventListener("change", function () {
    const sortOption = this.value;
    let sortedProducts = [...allProducts];
    if (sortOption === "Sort Alphabetically") {
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "Sort by price: low to high") {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "Sort by price: high to low") {
        sortedProducts.sort((a, b) => b.price - a.price);
    } else if (sortOption === "Default Sorting") {
        sortedProducts = [...allProducts];
    }

    let sortedCartona = "";
    sortedProducts.forEach((product, index) => {
        sortedCartona += `<div class="col-md-4">
                    <div class="card" onclick="location.href='../singleProducts/singleProduct.html?id=${product._id}'" >
                        <img id="img-${index}" class="card-img-top" src="${product.mainImage}" alt="Card image" />
                        <div class="card-body">
                            <p class="text-center my-1">${product.name}</p>
                            <p class="cat text-center">${product.category.name}</p>
                            <p class="price text-center">${product.price}$</p>
                        </div>
                    </div>
                </div>`;
    });

    document.getElementById("myData").innerHTML = sortedCartona;
});
