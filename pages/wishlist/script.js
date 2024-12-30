import { handleLogout, toggleAuthLinks, toggleLoader, updateCartQuantity } from "../../js/generalFunctions.js";
import { logoutButton } from "../../js/variables.js";

logoutButton.addEventListener("click", handleLogout);

// Fetch Wishlist Items
export const fetchWishlistItems = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        alert("You are not logged in. Please log in to access your wishlist.");
        return [];
    }
    toggleAuthLinks();

    try {
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/wishlist", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            alert("Failed to fetch wishlist items. Please try again later.");
            console.error("Failed to fetch wishlist items:", response.statusText);
            return [];
        }

        const data = await response.json();
        return data.wishlist.products;
    } catch (error) {
        alert("An error occurred while fetching wishlist items. Please check your connection.");
        console.error("Error fetching wishlist items:", error);
        return [];
    }
};

// Initialize Wishlist
export const initializeWishlist = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        window.location.href = "/"; // Redirect to the home page
        return; // Stop further execution
    }
    toggleAuthLinks();
    updateCartQuantity();

    toggleLoader(true);

    try {
        const wishlistItems = await fetchWishlistItems();
        if (!wishlistItems || wishlistItems.length === 0) {
            renderEmptyWishlist();
            return;
        }

        renderWishlistItems(wishlistItems);
        attachWishlistListeners();
    } catch (error) {
        alert("An error occurred while initializing the wishlist. Please refresh the page.");
        console.error("Error initializing wishlist:", error);
    } finally {
        toggleLoader(false);
    }
};

// Render Wishlist Items
export const renderWishlistItems = (items) => {
    const container = document.getElementById("wishlist-items");
    container.innerHTML = ""; // Clear previous items

    items.forEach((item) => {
        const productHTML = `
            <div class="product" data-product-id="${item._id}">
                <div class="product-image">
                    <img src="${item.mainImage}" alt="${item.name}">
                </div>
                <div class="product-details">
                    <div class="product-title"><strong>${item.name}</strong></div>
                </div>
                <div class="product-price">$${item.price.toFixed(2)}</div>
                <div class="product-removal">
                    <button class="remove-product">Remove</button>
                </div>
            </div>
        `;
        container.innerHTML += productHTML;
    });
};

// Render Empty Wishlist
export const renderEmptyWishlist = () => {
    const container = document.getElementById("wishlist-items");
    container.innerHTML = `
        <div class="empty-cart">
            <p>Your wishlist is empty. Start adding items now!</p>
            <a href="../products/index.html" class="btn">Go to Shop</a>
        </div>
    `;
};

// Attach Listeners to Wishlist
export const attachWishlistListeners = () => {
    const removeButtons = document.querySelectorAll(".remove-product");
    removeButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const productElement = event.target.closest(".product");
            const productId = productElement.dataset.productId;

            try {
                await removeWishlistItem(productId);
                productElement.remove();

                // If no more items, render empty wishlist
                if (!document.querySelectorAll(".product").length) {
                    renderEmptyWishlist();
                }

                alert("Item removed from wishlist successfully.");
            } catch (error) {
                alert("An error occurred while removing the item. Please try again.");
                console.error("Error removing product:", error);
            }
        });
    });
};

// Remove Wishlist Item
export const removeWishlistItem = async (productId) => {
    toggleLoader(true);

    try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/wishlist", {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
            throw new Error("Failed to remove product");
        }
    } catch (error) {
        alert("Failed to remove the product. Please try again.");
        console.error("Error removing product:", error);
    } finally {
        toggleLoader(false);
    }
};

// Initialize Wishlist on Page Load
document.addEventListener("DOMContentLoaded", initializeWishlist);
