import { handleLogout, toggleAuthLinks, updateCartQuantity } from "../../js/generalFunctions.js";
import { logoutButton } from "../../js/variables.js";
logoutButton.addEventListener("click", handleLogout);

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get("id");
var product;
var categoryID;
var cartona = "";
async function getproductOfCategory() {
    const url = `https://iti-js-project-backend.vercel.app/api/products/${product.category._id}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const response2 = await response.json();
        console.log(response2);
    } catch (error) {
        console.error(error.message);
    }
}

async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`https://iti-js-project-backend.vercel.app/api/products/${productId}`);
        const product = await response.json();
        categoryID = product.category._id;
        var images = [...product.otherImages, product.mainImage];
        var cartona = ` 
        <div class="product-page">
          <div class="image-gallery">
            <div class="thumbnails" style="width: 25%">
              <img src="${images[0]}" alt="thumb1"  onclick="replaceSRC(e)"/>
              <img src="${images[1]}" alt="thumb2"  onclick="replaceSRC(e)"/>
              <img src="${images[2]}" alt="thumb3"  onclick="replaceSRC(e)"/>
            </div>
            <div class="main-image">
              <img src="${images[3]}" alt="main product" id="mainImage"/>
            </div>
          </div>
          <div class="product-info"> 
            <nav class="breadcrumb">
              <span style="color:#767676 ">Home </span>/ <span style="color:#767676; ">Accessories</span> / <span>${product.name}</span> 
            </nav>
            <h1 style="font-size: 40px; font-weight: bolder;">${product.name}</h1>
            <p class="price">$${product.price}</p>
            <p class="description">${product.description}</p>
            <p>
              <div style="display: flex;align-items: center;">
                
                
                ${
                    product.quantity > 0
                        ? `<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#83b735">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/> <span>${product.quantity} in stock</span></svg>`
                        : `<span>Out of stock</span>`
                }
              </div>
            </p>
            <div class="actions">
              <div class="quantity">
                <button id="decreaseBtn">-</button>
                <input id="quantityInput" type="text" value="0" readonly>
                <button id="increaseBtn">+</button>
              </div>
              ${product.quantity > 0 ? `<button class="add-to-cart" id="addToCard">Add To Cart</button>` : ""}
                        </div>
        <div class="u-desc">
          <div class="extra-links" >
            <button style="border: 0;background-color:transparent; cursor:pointer"; > <div style="display: flex; justify-content: center ;"><svg xmlns="http://www.w3.org/2000/svg" height="25px" viewBox="0 -960 960 960" width="25px" fill="#000000"><path d="m336-168-51-51 105-105H96v-72h294L285-501l51-51 192 192-192 192Zm288-240L432-600l192-192 51 51-105 105h294v72H570l105 105-51 51Z"/></svg><span style="font-size: 15px;">Compare</span> </div> </button>
            <button style="border: 0;background-color:transparent; cursor:pointer";" id='addToWishlist'> <div style="display: flex; justify-content: center ;align-items: center;"><svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/></svg><span style="font-size: 15px;">Add to wishlist</span> </div> </button>
            <button style="border: 0;background-color:transparent; cursor:pointer";" > <div style="display: flex; justify-content: center ;align-items: center;">  <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000"><path d="m359-511 90-90-54-55-46 45-50-50 45-46-56-55-90 90 161 161Zm313 313 90-90-54-55-46 45-50-50 45-46-56-55-90 90 161 161Zm21-546 51 51-51-51ZM297-144H144v-153l164-163L96-672l192-192 212 212 142-143q11-11 24-16t27-5q14 0 27 5t24 16l51 51q11 11 16 24t5 27q0 14-5 27t-16 24L652-500l212 212L672-96 460-308 297-144Zm-81-72h51l375-375-51-51-375 375v51Zm401-401-26-25 51 51-25-26Z"/></svg><span style="font-size: 15px;">Size Guide</span> </div> </button>
          </div>
<hr>
          <p class="meta" style=" font-size: large;"><span style="color: black;">Categories:</span> ${product.category.name}</p>
          <div class="share" >
            <span >share:</span>
            <i class="fa-brands fa-facebook-f " ></i>
            <i class="fa-brands fa-x-twitter " ></i>
            <i class="fa-brands fa-pinterest " ></i>
            <i class="fa-brands fa-linkedin-in " ></i>
            <i class="fa-brands fa-telegram " ></i>
          </div>
        </div>
      </div>
  </div>`;
        document.getElementById("container").innerHTML = cartona;
        const decreaseBtn = document.getElementById("decreaseBtn");
        const increaseBtn = document.getElementById("increaseBtn");
        const quantityInput = document.getElementById("quantityInput");
        decreaseBtn.addEventListener("click", () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 0) {
                quantityInput.value = currentValue - 1;
            }
        });
        increaseBtn.addEventListener("click", () => {
            let currentValue = parseInt(quantityInput.value);
            if (currentValue < product.quantity) {
                quantityInput.value = currentValue + 1;
            }
        });
        document.querySelectorAll(".thumbnails img").forEach((img) => {
            img.addEventListener("click", function () {
                document.getElementById("mainImage").src = this.src;
            });
        });
    } catch (error) {
        console.error("Error:", error);
    }
}

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZjNjBjNjk5MDkzYWZmODRkMTM0NGYiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNTIwMjgxNCwiZXhwIjoxNzM1ODA3NjE0fQ.Xba6hWCTuoMyFkf8yipfJNFj9om4T7vrBJfSooXGItA";
async function getWishList() {
    try {
        const response = await fetch(`https://iti-js-project-backend.vercel.app/api/wishlist`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const wishlist = await response.json();
        const productExists = wishlist.wishlist.products.find((item) => item._id === productId);
        const wishlistButton = document.getElementById("addToWishlist");
        if (productExists) {
            wishlistButton.innerHTML = `
          <div style="display: flex; justify-content: center; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
              <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
              <span>Added to Wishlist</span>
          </div>`;
        } else {
            wishlistButton.innerHTML = `
          <div style="display: flex; justify-content: center; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="#000000">
              <path d="m480-144-50-45q-100-89-165-152.5t-102.5-113Q125-504 110.5-545T96-629q0-89 61-150t150-61q49 0 95 21t78 59q32-38 78-59t95-21q89 0 150 61t61 150q0 43-14 83t-51.5 89q-37.5 49-103 113.5T528-187l-48 43Zm0-97q93-83 153-141.5t95.5-102Q764-528 778-562t14-67q0-59-40-99t-99-40q-35 0-65.5 14.5T535-713l-35 41h-40l-35-41q-22-26-53.5-40.5T307-768q-59 0-99 40t-40 99q0 33 13 65.5t47.5 75.5q34.5 43 95 102T480-241Zm0-264Z"/></svg>
              <span style="font-size: 15px;">Add to wishlist</span>
          </div>`;
            wishlistButton.addEventListener("click", async function () {
                try {
                    const addResponse = await fetch(`https://iti-js-project-backend.vercel.app/api/wishlist`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ productId: productId }),
                    });
                    if (!addResponse.ok) {
                        throw new Error(`HTTP error! Status: ${addResponse.status}`);
                    }
                    wishlistButton.innerHTML = `
              <div style="display: flex; justify-content: center; align-items: center;">
                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                  <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>
                  <span>Added to Wishlist</span>
              </div>`;
                    window.location.reload();
                } catch (error) {
                    console.error("Error adding to wishlist:", error);
                }
            });
        }
    } catch (error) {
        console.error("Error checking wishlist:", error);
    }
}
async function addProductToCart() {
    try {
        const response = await fetch(`https://iti-js-project-backend.vercel.app/api/cart`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const cart = await response.json();
        // console.log(cart.cart.items[0].product._id)
        const productExistsInCart = cart.cart.items.find((item) => item.product._id === productId);

        console.log(productExistsInCart);
        const cartButton = document.getElementById("addToCard");
        if (productExistsInCart) {
            cartButton.innerHTML = `Added To Cart`;
        } else {
            cartButton.innerHTML = `
          Add To Cart`;
            wishlistButton.addEventListener("click", async function () {
                try {
                    const addResponse = await fetch(`https://iti-js-project-backend.vercel.app/api/cart`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            productId: productId,
                            quantity: quantityInput.value,
                        }),
                    });
                    if (!addResponse.ok) {
                        throw new Error(`HTTP error! Status: ${addResponse.status}`);
                    }
                    wishlistButton.innerHTML = `
              Added To Cart`;
                    window.location.reload();
                } catch (error) {
                    console.error("Error adding to wishlist:", error);
                }
            });
        }
    } catch (error) {
        console.error("Error checking wishlist:", error);
    }
}

async function getProductsByCategoryID(id) {
    try {
        const response = await fetch(`https://iti-js-project-backend.vercel.app/api/categories/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const category = await response.json();
        console.log(category);
    } catch (error) {
        console.error("Error fetching products by category ID:", error);
    }
}

// getProductsByCategoryID(categoryID);
window.onload = () => {
    toggleAuthLinks();
    updateCartQuantity();
    fetchProductDetails(productId);
    getWishList();
    addProductToCart();
};
