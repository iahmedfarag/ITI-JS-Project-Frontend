/************************************
 *  generalFunctions.js
 ************************************/
import { loaderElement } from "./variables.js";

/** Track loader state */
let loading = false;

/**
 * Toggles the global loader.
 * @param {boolean} status - true to show loader, false to hide.
 */
export const toggleLoader = (status) => {
    if (!loaderElement) {
        console.warn("Loader element not found in the DOM.");
        return;
    }

    if (status) {
        loading = true;
        loaderElement.style.display = "block";
    } else {
        loading = false;
        loaderElement.style.display = "none";
    }
};

/**
 * Toggles auth-related links based on token presence.
 */
export const toggleAuthLinks = () => {
    const loginLink = document.getElementById("login");
    const userProfileLink = document.getElementById("userProfile");
    const logoutButton = document.getElementById("logout");
    const cartLink = document.querySelector(".cart");
    const wishlistLink = document.querySelector('a[href*="/wishlist"]') || document.querySelector(".wishListBtn"); // or however you’re selecting your wishlist link
    const authToken = localStorage.getItem("authToken");

    // If any of these elements are missing, log a warning and exit early.
    if (!loginLink || !userProfileLink || !logoutButton || !cartLink || !wishlistLink) {
        console.warn("One or more auth link elements are missing in the DOM.");
        return;
    }

    if (authToken) {
        // User is logged in
        loginLink.style.display = "none";
        userProfileLink.style.display = "block";
        logoutButton.style.display = "inline-block";
        cartLink.style.display = "block";
        wishlistLink.style.display = "block";
    } else {
        // User is logged out
        loginLink.style.display = "block";
        userProfileLink.style.display = "none";
        logoutButton.style.display = "none";
        cartLink.style.display = "none";
        wishlistLink.style.display = "none";
    }
};

/**
 * Logout Functionality
 */
export const handleLogout = () => {
    localStorage.removeItem("authToken");
    toggleAuthLinks();
    // Optionally redirect to home or login page
    window.location.href = "/";
};

/**
 * Fetch the cart and return an array of product IDs or an empty array.
 */
export const fetchCart = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        console.warn("No auth token found; skipping cart fetch.");
        return [];
    }

    try {
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/cart", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch cart:", response.statusText);
            return [];
        }

        const data = await response.json();
        // Defensive null check
        if (!data?.cart?.items) {
            console.warn("Cart is null or undefined in the response:", data);
            return [];
        }

        // Return an array of product IDs
        return data.cart.items.map((item) => item.product._id);
    } catch (error) {
        console.error("Error fetching cart:", error);
        return [];
    }
};

/**
 * Updates the cart quantity in the navbar by fetching the cart again.
 */
export const updateCartQuantity = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        console.warn("No auth token found; skipping cart quantity update.");
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
            console.error("Failed to fetch cart data for updating quantity");
            return;
        }

        const data = await response.json();

        if (!data?.cart?.items) {
            console.warn("Cart is empty or null while updating quantity:", data);
            return;
        }

        const cartQuantity = data.cart.items.reduce((total, item) => total + item.quantity, 0);

        // Update all .cart .quantity elements
        const quantityElements = document.querySelectorAll(".cart .quantity");
        quantityElements.forEach((el) => {
            el.textContent = cartQuantity;
        });
    } catch (error) {
        console.error("Error updating cart quantity:", error);
    }
};

/**
 * Add a product to the cart.
 * @param {string} id - The product ID to add to the cart
 */
export const addProductToCart = async (id) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        alert("Please log in first to add products to your cart.");
        return;
    }

    try {
        // Find the button for visual feedback
        const button = document.querySelector(`.add-to-cart-btn[data-id="${id}"]`);
        if (!button) {
          
            return;
        }

        const originalText = button.textContent;
        button.textContent = "Loading...";
        button.disabled = true;

        toggleLoader(true);

        const addResponse = await fetch("https://iti-js-project-backend.vercel.app/api/cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ productId: id }),
        });

        toggleLoader(false);

        if (!addResponse.ok) {
            button.textContent = originalText;
            button.disabled = false;
            const errorData = await addResponse.json();
        
            return;
        }

      
        button.textContent = "Added To Cart";
        button.disabled = true;

        // Update cart quantity in navbar
        await updateCartQuantity();
    } catch (error) {
        toggleLoader(false);
        console.error("Error adding product to cart:", error);
        const button = document.querySelector(`.add-to-cart-btn[data-id="${id}"]`);
        if (button) {
            button.textContent = "Add To Cart";
            button.disabled = false;
        }
       
    }
};

/**
 * Fetch the wishlist and return an array of product IDs or an empty array.
 */
export const fetchWishlist = async () => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        console.warn("No auth token found; skipping wishlist fetch.");
        return [];
    }

    try {
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/wishlist", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            console.error("Failed to fetch wishlist");
            return [];
        }

        const wishlist = await response.json();
        if (!wishlist?.wishlist?.products) {
            console.warn("No wishlist products found in the response:", wishlist);
            return [];
        }

        // Return an array of product IDs
        return wishlist.wishlist.products.map((item) => item._id);
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return [];
    }
};

/**
 * Toggle add/remove product from wishlist.
 * @param {string} id - The product ID
 * @param {HTMLElement} heartIcon - The heart icon element
 */
export const toggleWishlistItem = async (id, heartIcon) => {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        alert("Please log in first to manage your wishlist.");
        return;
    }

    try {
        const isAdded = heartIcon.classList.contains("fa-solid");
        const method = isAdded ? "DELETE" : "POST";

        const response = await fetch("https://iti-js-project-backend.vercel.app/api/wishlist", {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ productId: id }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return;
        }

        if (isAdded) {
            heartIcon.classList.remove("fa-solid");
            heartIcon.classList.add("fa-regular");
            heartIcon.style.color = "";
          
        } else {
            heartIcon.classList.remove("fa-regular");
            heartIcon.classList.add("fa-solid");
            heartIcon.style.color = "red";
        
        }
    } catch (error) {
        console.error("Error managing wishlist:", error);
      
    }
};
