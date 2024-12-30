// Import necessary elements
import { handleLogout, toggleAuthLinks, toggleLoader, updateCartQuantity } from "../../js/generalFunctions.js";
import { logoutButton } from "../../js/variables.js";
logoutButton.addEventListener("click", handleLogout);

const taxRate = 0.05;
const shippingRate = 15.0;

// Fetch Cart Items
export const fetchCartItems = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        alert("You are not logged in. Please log in to access your cart.");
        return;
    }

    try {
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/cart", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            alert("Failed to fetch cart items. Please try again later.");
            console.error("Failed to fetch cart items:", response.statusText);
            return [];
        }

        const data = await response.json();
        return data.cart?.items;
    } catch (error) {
        alert("An error occurred while fetching cart items. Please check your connection.");
        console.error("Error fetching cart items:", error);
        return [];
    }
};

// Initialize Cart
export const initializeCart = async () => {
    // Check if the user is already logged in
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        window.location.href = "/"; // Redirect to the home page
        return; // Stop further execution
    }
    toggleAuthLinks();
    toggleLoader(true);

    try {
        const cartItems = await fetchCartItems();
        if (!cartItems || cartItems.length === 0) {
            renderEmptyCart();
            return;
        }

        renderCartItems(cartItems);
        attachCartListeners();
        recalculateCart();
    } catch (error) {
        alert("An error occurred while initializing the cart. Please refresh the page.");
        console.error("Error initializing cart:", error);
    } finally {
        toggleLoader(false);
    }
};

// Render Cart Items
export const renderCartItems = (items) => {
    const container = document.getElementById("product-container");
    const totalsSection = document.querySelector(".totals");
    const checkoutButton = document.querySelector(".checkout");

    container.innerHTML = ""; // Clear previous items

    if (items && items.length > 0) {
        // Show totals and checkout button
        totalsSection.classList.remove("hidden");
        checkoutButton.classList.remove("hidden");

        items.forEach((item) => {
            const productHTML = `
                <div class="product" data-product-id="${item.product._id}">
                    <div class="product-image">
                        <img src="${item.product.mainImage}" alt="${item.product.name}">
                    </div>
                    <div class="product-details">
                        <div class="product-title"><strong>${item.product.name}</strong></div>
                        <p class="product-description">${item.product.description}</p>
                    </div>
                    <div class="product-price">${item.product.price.toFixed(2)}</div>
                    <div class="product-quantity">
                        <button class="qty-btn decrease">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn increase">+</button>
                    </div>
                    <div class="product-removal">
                        <button class="remove-product">Remove</button>
                    </div>
                    <div class="product-line-price">${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
            `;
            container.innerHTML += productHTML;
        });
    } else {
        renderEmptyCart(); // Render empty cart UI if no items
    }
};

// Render Empty Cart
export const renderEmptyCart = () => {
    const container = document.getElementById("product-container");
    const totalsSection = document.querySelector(".totals");
    const checkoutButton = document.querySelector(".checkout");

    container.innerHTML = `
        <div class="empty-cart">
            <h3>Your cart is empty</h3>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <a href="../products/index.html" class="shop-now-button">Shop Now</a>
        </div>
    `;

    // Hide totals and checkout button
    totalsSection.classList.add("hidden");
    checkoutButton.classList.add("hidden");
};

// Attach Listeners to Cart
export const attachCartListeners = () => {
    const removeButtons = document.querySelectorAll(".remove-product");
    removeButtons.forEach((button) => {
        button.addEventListener("click", async (event) => {
            const productElement = event.target.closest(".product");
            const productId = productElement.dataset.productId;

            try {
                await removeCartItem(productId);
                productElement.remove();
                recalculateCart();
                updateCartQuantity();

                // If no more items, render empty cart
                if (!document.querySelectorAll(".product").length) {
                    renderEmptyCart();
                }

                alert("Item removed from cart successfully.");
            } catch (error) {
                alert("An error occurred while removing the item. Please try again.");
                console.error("Error removing product:", error);
            }
        });
    });

    const decreaseBtns = document.querySelectorAll(".qty-btn.decrease");
    const increaseBtns = document.querySelectorAll(".qty-btn.increase");

    decreaseBtns.forEach((btn) => {
        btn.addEventListener("click", () => handleQuantityChange(btn, -1));
    });
    increaseBtns.forEach((btn) => {
        btn.addEventListener("click", () => handleQuantityChange(btn, 1));
    });
};

const handleQuantityChange = async (button, delta) => {
    const productRow = button.closest(".product");
    const productId = productRow.getAttribute("data-product-id");
    const qtyValueElem = productRow.querySelector(".qty-value");
    const currentQty = parseInt(qtyValueElem.textContent, 10) || 1;

    let newQty = currentQty + delta;
    if (newQty < 1) {
        alert("Quantity must be at least 1.");
        return;
    }

    toggleLoader(true);
    try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/cart", {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId, quantity: newQty }),
        });

        if (!response.ok) {
            throw new Error("Failed to update quantity");
        }

        qtyValueElem.textContent = newQty;
        const price = parseFloat(productRow.querySelector(".product-price").textContent);
        const linePrice = (price * newQty).toFixed(2);
        productRow.querySelector(".product-line-price").textContent = linePrice;

        recalculateCart();
        updateCartQuantity();
        alert("Quantity updated successfully.");
    } catch (error) {
        alert("An error occurred while updating the quantity. Please try again.");
        console.error("Error updating quantity:", error);
    } finally {
        toggleLoader(false);
    }
};

// Remove Cart Item
export const removeCartItem = async (productId) => {
    toggleLoader(true);

    try {
        const authToken = localStorage.getItem("authToken");
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/cart", {
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

// Recalculate Cart
export const recalculateCart = () => {
    let subtotal = 0;

    document.querySelectorAll(".product").forEach((product) => {
        subtotal += parseFloat(product.querySelector(".product-line-price").textContent);
    });

    const tax = subtotal * taxRate;
    const shipping = subtotal > 0 ? shippingRate : 0;
    const total = subtotal + tax + shipping;

    document.getElementById("cart-subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("cart-tax").textContent = tax.toFixed(2);
    document.getElementById("cart-shipping").textContent = shipping.toFixed(2);
    document.getElementById("cart-total").textContent = total.toFixed(2);

    document.querySelector(".checkout").style.display = total === 0 ? "none" : "block";
};

// Initialize Cart on Page Load
document.addEventListener("DOMContentLoaded", initializeCart);
