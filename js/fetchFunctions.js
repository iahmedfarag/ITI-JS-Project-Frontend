// get products
const getProducts = async () => {
    try {
        url = "https://iti-js-project-backend.vercel.app/api/products";
        const response = await fetch(url);

        if (!response.ok) {
            console.error("Error posting data:", error.message);
        }

        const result = await response.json();

        products = result;

        console.log("products ==>", products);
        renderProducts();

        return result;
    } catch (error) {
        console.error("Error posting data:", error.message);
        throw error;
    }
};

// get categories
const getCategories = async () => {
    try {
        url = "https://iti-js-project-backend.vercel.app/api/categories";
        const response = await fetch(url);

        if (!response.ok) {
            console.error("Error posting data:", error.message);
        }

        const result = await response.json();
        categories = result;
        console.log("categories ==>", result);

        categoriesSliderElement.innerHTML = `${categories?.map((cat) => `<a href="/categories/${cat.name.toLowerCase()}">${cat.name}</a>`).join("")}`;
        categoriesMobileElement.innerHTML = `${categories?.map((cat) => `<a href="/categories/${cat.name.toLowerCase()}">${cat.name}</a>`).join("")}`;

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
                        <img src="./public/cat (${i + 2}).jpg" alt="Furniture 2" />
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
        return result;
    } catch (error) {
        console.error("Error posting data:", error.message);
        throw error;
    }
};
