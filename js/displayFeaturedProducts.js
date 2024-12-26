// // START - feature products
// const displayFeatureProducts = () => {
//     featuredProductsElement.innerHTML = `
// ${products
//     .filter((item) => item.isFeatured !== false)
//     .map((prd) => {
//         return `
//             <div class="featuredProduct"
//                  onmouseenter="handleMouseEnter(this)"
//                  onmouseleave="handleMouseLeave(this)"
//                  >
//                 <div class="img-container">
//                     <img src="${prd.mainImage}"
//                          alt="${prd.name}"
//                          data-mainimg="${prd.mainImage}"
//                          data-secondimg="${prd.otherImages[0] || prd.mainImage}" />
//                 </div>
//                 <div class="info">
//                     <a href="/products/${prd._id}" target="_blank" class="title">${prd.name}</a>
//                     <a href="/category/${prd.category._id}" class="cat">${prd.category.name}</a>
//                     <p class="price">${prd.price}</p>
//                 </div>
//                 <div class="content">
//                     <p>${prd.description}</p>
//                     <div class="btns">
//                         <i class="fa-regular fa-heart" onclick="addToWishlist('${prd._id}')"></i>
//                         <button onclick="addToCart('${prd._id}')">Add To Cart</button>
//                         <i class="fa-solid fa-magnifying-glass" onclick="viewDetails('${prd._id}')"></i>
//                     </div>
//                 </div>
//             </div>
//         `;
//     })
//     .join("")}

//     `;
// };
// // END - feature products

// // END - feature products

// const handleMouseEnter = (e) => {
//     const img = e.querySelector(".img-container img");
//     if (!img) {
//         console.error("Image element not found within .img-container");
//         return;
//     }

//     const secondSrc = img.dataset.secondimg;
//     if (!secondSrc) {
//         console.warn("data-secondimg attribute is missing.");
//         return;
//     }

//     img.src = secondSrc;
// };

// const handleMouseLeave = (e) => {
//     const img = e.querySelector(".img-container img");
//     if (!img) {
//         console.error("Image element not found within .img-container");
//         return;
//     }

//     const mainSrc = img.dataset.mainimg;
//     if (!mainSrc) {
//         console.warn("data-mainimg attribute is missing.");
//         return;
//     }

//     img.src = mainSrc;
// };

// // START - Feature Products

// let slideIndex = 1;
// showSlides(slideIndex);

// // Next/previous controls
// function plusSlides(n) {
//     showSlides((slideIndex += n));
// }

// // Thumbnail image controls
// function currentSlide(n) {
//     showSlides((slideIndex = n));
// }

// function showSlides(n) {
//     let i;
//     let slides = document.getElementsByClassName("featuredProduct");
//     if (n > slides.length) {
//         slideIndex = 1;
//     }
//     if (n < 1) {
//         slideIndex = slides.length;
//     }
//     for (i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }
//     slides[slideIndex - 1].style.display = "block";
// }

// Sample Products Array
// Replace this with your actual products data
// Initialize products array

// DOM Elements
const prevArrow = document.getElementById("prevArrow");
const nextArrow = document.getElementById("nextArrow");

let itemsPerPage = 4; // Default number of items per page
let currentPage = 1;
let totalPages = 1;

// Function to Adjust Items Per Page Based on Screen Size
const updateItemsPerPage = () => {
    if (window.matchMedia("(min-width: 992px)").matches) {
        itemsPerPage = 4; // 4 items per row for large screens
    } else if (window.matchMedia("(min-width: 768px)").matches) {
        itemsPerPage = 3; // 3 items per row for medium screens
    } else if (window.matchMedia("(min-width: 576px)").matches) {
        itemsPerPage = 2; // 2 items per row for small screens
    } else {
        itemsPerPage = 1; // 1 item per row for extra small screens
    }
    renderProducts(); // Re-render products after adjusting itemsPerPage
};

// Function to Render Products Based on Current Page
const renderProducts = () => {
    // Filter featured products
    const featuredProducts = products.filter((item) => item.isFeatured !== false);
    totalPages = Math.ceil(featuredProducts.length / itemsPerPage);

    // Ensure currentPage is within bounds
    if (currentPage > totalPages) {
        currentPage = totalPages;
    }
    if (currentPage < 1) {
        currentPage = 1;
    }

    // Calculate start and end indices
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = featuredProducts.slice(startIndex, endIndex);

    // Generate HTML for current products
    featuredProductsElement.innerHTML = currentProducts
        .map(
            (prd) => `
        <div class="featuredProduct"
             onmouseenter="handleMouseEnter(this)"
             onmouseleave="handleMouseLeave(this)">
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
                <p>${prd.description}</p>
                <div class="btns">
                    <i class="fa-regular fa-heart" onclick="addToWishlist('${prd._id}')"></i>
                    <button onclick="addToCart('${prd._id}')">Add To Cart</button>
                    <i class="fa-solid fa-magnifying-glass" onclick="viewDetails('${prd._id}')"></i>
                </div>
            </div>
        </div>
    `
        )
        .join("");

    // Update Arrow States
    updateArrows();
};

// Function to Update Arrow Buttons
const updateArrows = () => {
    prevArrow.disabled = currentPage === 1;
    nextArrow.disabled = currentPage === totalPages || totalPages === 0;
};

// Event Listeners for Arrows
prevArrow.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
    }
});

nextArrow.addEventListener("click", () => {
    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
    }
});

// Image Hover Functions
const handleMouseEnter = (element) => {
    const img = element.querySelector("img");
    if (img && img.dataset.secondimg) {
        img.src = img.dataset.secondimg;
    }
};

const handleMouseLeave = (element) => {
    const img = element.querySelector("img");
    if (img && img.dataset.mainimg) {
        img.src = img.dataset.mainimg;
    }
};

// Placeholder Functions for Wishlist and Cart (Optional)
const addToWishlist = (id) => {
    console.log(`Add product ${id} to wishlist`);
};

const addToCart = (id) => {
    console.log(`Add product ${id} to cart`);
};

const viewDetails = (id) => {
    console.log(`View details for product ${id}`);
};
window.addEventListener("resize", updateItemsPerPage);
