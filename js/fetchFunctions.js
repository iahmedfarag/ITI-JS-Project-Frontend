import { renderProducts } from "./displayFeaturedProducts.js";
import { toggleLoader } from "./generalFunctions.js";
import { categories, categoriesMobileElement, categoriesSliderElement, featuredCategoriesContainerElement, products } from "./variables.js";

const getProducts = async () => {
    try {
        toggleLoader(true); // Start loader for products
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/products");

        if (!response.ok) {
            console.error("Error fetching products:", response.statusText);
            return;
        }

        const result = await response.json();

        // Clear the array and update its contents
        products.length = 0;
        products.push(...result);

        console.log("products ==>", products);

        if (typeof renderProducts === "function") {
            renderProducts(); // Only call if `renderProducts` is defined
        }

        return result;
    } catch (error) {
        console.error("Error fetching products:", error.message);
        throw error;
    } finally {
        toggleLoader(false); // Stop loader for products
    }
};

const getCategories = async () => {
    try {
        toggleLoader(true); // Start loader for categories
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/categories");

        if (!response.ok) {
            console.error("Error fetching categories:", response.statusText);
            return;
        }

        const result = await response.json();

        // Clear the array and update its contents
        categories.length = 0;
        categories.push(...result);

        console.log("categories ==>", result);

        // Safely update `categoriesSliderElement`
        if (categoriesSliderElement) {
            categoriesSliderElement.innerHTML = categories.map((cat) => `<a href="/categories/${cat.name.toLowerCase()}">${cat.name}</a>`).join("");
        }

        // Safely update `categoriesMobileElement`
        if (categoriesMobileElement) {
            categoriesMobileElement.innerHTML = categories.map((cat) => `<a href="/categories/${cat.name.toLowerCase()}">${cat.name}</a>`).join("");
        }

        // Safely update `featuredCategoriesContainerElement`
        if (featuredCategoriesContainerElement) {
            const displayFeaturedCategories = (main, arr) => {
                featuredCategoriesContainerElement.innerHTML = `
                    <div class="main">
                        <div class="featuredCategory">
                            <img src="./public/cat (1).jpg" alt="Furniture 1" />
                            <div class="content">
                                <p>${main.name}</p>
                                <span>${main.products.length} Products</span>
                            </div>
                        </div>
                    </div>
                    <div class="others">
                        ${arr
                            .map(
                                (cat, i) => `
                            <div class="featuredCategory">
                                <img src="./public/cat (${i + 2}).jpg" alt="Furniture ${i + 2}" />
                                <div class="content">
                                    <p>${cat.name}</p>
                                    <span>${cat.products.length} Products</span>
                                </div>
                            </div>
                        `
                            )
                            .join("")}
                    </div>
                `;
            };

            displayFeaturedCategories(categories[0], categories.slice(1, 5));
        }

        return result;
    } catch (error) {
        console.error("Error fetching categories:", error.message);
        throw error;
    } finally {
        toggleLoader(false); // Stop loader for categories
    }
};

// Call both functions individually after DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    getProducts();
    getCategories();
});
