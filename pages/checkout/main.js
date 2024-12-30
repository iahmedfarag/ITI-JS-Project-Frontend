import { handleLogout, toggleAuthLinks, updateCartQuantity } from "../../js/generalFunctions.js";
import { logoutButton } from "../../js/variables.js";

// Using the same tax and shipping rates as in the cart code
const taxRate = 0.05;
const shippingRate = 15.0;

logoutButton.addEventListener("click", handleLogout);

// Validation Setup
const inputs = [
    {
        id: "checkout-email",
        errorId: "email-e",
        errorMessage: "Please enter a valid email address.",
        regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    {
        id: "checkout-phone",
        errorId: "phone-e",
        errorMessage: "Please enter a valid phone number.",
        regex: /^01[0-2,5][0-9]{8}$/,
    },
    {
        id: "checkout-name",
        errorId: "name-e",
        errorMessage: "Full Name cannot be empty.",
        regex: /.+/,
    },
    {
        id: "checkout-address",
        errorId: "address-e",
        errorMessage: "Address must contain at least three words.",
        regex: /^(\w+\s+){2,}\w+$/,
    },
];

// Centralized Validation Handler
function validateField(inputElement, errorElement, regex, errorMessage) {
    const value = inputElement.value.trim();

    if (!regex.test(value)) {
        errorElement.textContent = value === "" ? "This field cannot be empty." : errorMessage;
        errorElement.style.display = "block";
        inputElement.style.border = "2px solid red";
        inputElement.style.backgroundColor = "#ffe6e6";
        return false;
    }

    errorElement.style.display = "none";
    inputElement.style.border = "2px solid green";
    inputElement.style.backgroundColor = "white";
    return true;
}

// Add Validation for Each Input
inputs.forEach(({ id, errorId, errorMessage, regex }) => {
    const inputElement = document.getElementById(id);
    const errorElement = document.getElementById(errorId);

    inputElement.addEventListener("blur", () => {
        validateField(inputElement, errorElement, regex, errorMessage);
    });

    inputElement.addEventListener("input", () => {
        validateField(inputElement, errorElement, regex, errorMessage);
    });
});

// Handle Form Submission
const form = document.getElementById("checkout-form");
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        alert("You are not logged in. Please log in to access your cart.");
        return;
    }

    let isValid = true;

    // Validate all fields
    inputs.forEach(({ id, errorId, errorMessage, regex }) => {
        const inputElement = document.getElementById(id);
        const errorElement = document.getElementById(errorId);

        if (!validateField(inputElement, errorElement, regex, errorMessage)) {
            isValid = false;
        }
    });

    if (!isValid) return; // Stop if any validation fails

    // Submit form if validation passes
    const data = {
        name: form["checkout-name"].value,
        email: form["checkout-email"].value,
        address: form["checkout-address"].value,
        phone: form["checkout-phone"].value,
    };

    try {
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/order/checkout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(`Error: ${error.message || "Failed to submit order."}`);
            return;
        }

        const result = await response.json();
        alert("Order submitted successfully!");
        console.log(result);

        // Navigate user to the home page after successful order
        window.location.href = "/";
    } catch (error) {
        console.error("An error occurred:", error);
        alert("Failed to submit order. Please try again.");
    }
});

// Fetch Cart Items and Render on Checkout
async function fetchCartItemsForCheckout() {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        alert("You are not logged in. Please log in to access your cart.");
        return [];
    }

    try {
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/cart", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) throw new Error("Failed to fetch cart items.");

        const data = await response.json();
        return data.cart.items; // Return array of items
    } catch (error) {
        console.error("Error fetching cart items:", error);
        return [];
    }
}

async function renderCheckoutItems() {
    toggleAuthLinks();
    updateCartQuantity();

    const container = document.getElementById("p-check");
    container.innerHTML = "Loading...";

    const items = await fetchCartItemsForCheckout();
    container.innerHTML = ""; // Clear "Loading..."

    if (!items || items.length === 0) {
        // If cart is empty, redirect user back to cart page
        alert("Your cart is empty. Redirecting you to the cart page.");
        window.location.href = "../cart/index.html";
        return;
    }

    // Render each item
    let subtotal = 0;
    items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";

        const price = item.product.price;
        const quantity = item.quantity;
        const lineTotal = price * quantity;

        subtotal += lineTotal;

        card.innerHTML = `
        <div class="card-image">
            <img src="${item.product.mainImage}" alt="${item.product.name}">
        </div>
        <div class="card-details">
            <div class="card-name">${item.product.name}</div>
            <div class="card-price"><span>Price:</span> $${price}</div>
            <div class="card-quantity"><span>Quantity:</span> ${quantity}</div>
        </div>
      `;
        container.appendChild(card);
    });

    // Calculate totals
    recalcCheckoutTotals(subtotal);
}

/**
 * Recalculates and updates the checkout totals on the page.
 */
function recalcCheckoutTotals(subtotal) {
    const tax = subtotal * taxRate;
    const shipping = subtotal > 0 ? shippingRate : 0;
    const total = subtotal + tax + shipping;

    // Update the DOM with correct values
    document.querySelector(".checkout-shipping p").textContent = `$${shipping.toFixed(2)}`;
    document.querySelectorAll(".checkout-total")[0].querySelector("p").textContent = `$${tax.toFixed(2)}`; // Tax (5%)
    document.querySelectorAll(".checkout-total")[1].querySelector("p").textContent = `$${total.toFixed(2)}`; // Grand Total
}

// Clears the displayed totals (if needed)
function updateCheckoutTotals(shipping, tax, total) {
    document.querySelector(".checkout-shipping p").textContent = `$${shipping.toFixed(2)}`;
    document.querySelectorAll(".checkout-total")[0].querySelector("p").textContent = `$${tax.toFixed(2)}`;
    document.querySelectorAll(".checkout-total")[1].querySelector("p").textContent = `$${total.toFixed(2)}`;
}

// Initialize on Page Load
document.addEventListener("DOMContentLoaded", renderCheckoutItems);
