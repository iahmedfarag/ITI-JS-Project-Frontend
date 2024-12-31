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
                    <div class="">
                        <div class="hover-buttons">
                        <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960"
                            width="35px" fill="#b0b0b0">
                            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                        </svg>
                        <button style="border: 0;background-color: #74a32f;color: white;width: 40%;height: 40px;border-radius: 8px;">
                            Add To Card
                        </button>
                        <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960"
                            width="35px" fill="#b0b0b0">
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                        </svg>
                        </div>
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
                <div class="">
                    <div class="hover-buttons">
                        <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960"
                            width="35px" fill="#b0b0b0">
                            <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                        </svg>
                        <button style="border: 0;background-color: #74a32f;color: white;width: 40%;height: 40px;border-radius: 8px;">
                            Add To Card
                        </button>
                        <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960"
                            width="35px" fill="#b0b0b0">
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                        </svg>
                    </div>
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
                        <div class="hover-content">
                            <p style="text-align: center; margin-bottom: 20px">
                                ${product.description}
                            </p>
                            <div class="hover-buttons">
                <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960"
                    width="35px" fill="#b0b0b0">
                    <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
                </svg>
                <button style="border: 0;background-color: #74a32f;color: white;width: 40%;height: 40px;border-radius: 8px;">
                    Add To Card
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" height="35px" viewBox="0 -960 960 960"
                    width="35px" fill="#b0b0b0">
                    <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                </svg>
            </div>
                        </div>
                    </div>
                </div>`;
    });

    document.getElementById("myData").innerHTML = sortedCartona;
});
