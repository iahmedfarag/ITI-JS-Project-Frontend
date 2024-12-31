import { addProductToCart, fetchCart, fetchWishlist, toggleWishlistItem, updateCartQuantity } from "./generalFunctions.js";
import { featuredProductsElement, products } from "./variables.js";

let itemsPerPage = 4; // Default number of items per page
let currentPage = 1;
let totalPages = 1;

let wishlistProductIds = []; // Global wishlist data

// Function to Adjust Items Per Page Based on Screen Size
const updateItemsPerPage = () => {
    if (window.matchMedia("(min-width: 992px)").matches) {
        itemsPerPage = 4;
    } else if (window.matchMedia("(min-width: 768px)").matches) {
        itemsPerPage = 3;
    } else if (window.matchMedia("(min-width: 576px)").matches) {
        itemsPerPage = 2;
    } else {
        itemsPerPage = 1;
    }
    renderProducts();
};

// Function to Render Products
export const renderProducts = async () => {
    const featuredProductsElement = document.getElementById("featuredProducts");
    if (!featuredProductsElement) return; // Ensure the container exists

    const cartProductIds = await fetchCart();
    const featuredProducts = products.filter((item) => item.isFeatured !== false);
    totalPages = Math.ceil(featuredProducts.length / itemsPerPage);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = featuredProducts.slice(startIndex, endIndex);

    featuredProductsElement.innerHTML = currentProducts
        .map(
            (prd) => `
            <div class="featuredProduct">
                <div class="img-container">
                    <img src="${prd.mainImage}"
                         alt="${prd.name}"
                         data-mainimg="${prd.mainImage}"
                         data-secondimg="${prd.otherImages[0] || prd.mainImage}"
                         onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200?text=Image+Not+Available';" />
                </div>
                <div class="info">
                    <a href="/products/${prd._id}" target="_blank" class="title">${prd.name}</a>
                    <a href="/category/${prd.category._id}" class="cat">${prd.category.name}</a>
                    <p class="price">${prd.price}</p>
                </div>
                <div class="content">
                    <p>${prd.description.length > 100 && prd.description.slice(0, 100)}</p>
                    <div class="btns">
                        <i class="fa-regular fa-heart wishlist-icon" data-id="${prd._id}"></i>
                        <button class="add-to-cart-btn" data-id="${prd._id}">Add To Cart</button>
                        <i class="fa-solid fa-magnifying-glass" onclick="viewDetails('${prd._id}')"></i>
                    </div>
                </div>
            </div>
        `
        )
        .join("");

    document.querySelectorAll(".wishlist-icon").forEach((icon) => {
        const productId = icon.dataset.id;

        if (wishlistProductIds.includes(productId)) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
            icon.style.color = "red";
        }

        icon.addEventListener("click", () => toggleWishlistItem(productId, icon));
    });

    document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
        const productId = button.dataset.id;

        if (cartProductIds.includes(productId)) {
            button.textContent = "Added To Cart";
            button.disabled = true;
        } else {
            button.addEventListener("click", () => addProductToCart(productId));
        }
    });
    updateArrows();
};

// Initialize Wishlist
const initializeWishlist = async () => {
    wishlistProductIds = await fetchWishlist();
};

// Function to Update Arrow Buttons
const updateArrows = () => {
    const prevArrow = document.getElementById("prevArrow");
    const nextArrow = document.getElementById("nextArrow");

    if (prevArrow) prevArrow.disabled = currentPage === 1;
    if (nextArrow) nextArrow.disabled = currentPage === totalPages || totalPages === 0;
};

// Event Listeners
document.addEventListener("DOMContentLoaded", async () => {
    const prevArrow = document.getElementById("prevArrow");
    const nextArrow = document.getElementById("nextArrow");

    if (prevArrow) {
        prevArrow.addEventListener("click", () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts();
            }
        });
    }

    if (nextArrow) {
        nextArrow.addEventListener("click", () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderProducts();
            }
        });
    }

    window.addEventListener("resize", updateItemsPerPage);

    await initializeWishlist();
    await updateCartQuantity(); // Update cart quantity on page load
    updateItemsPerPage();
});
