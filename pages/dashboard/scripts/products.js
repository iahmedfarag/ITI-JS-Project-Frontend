//Products

let allProducts = [];

const alertUser = (msg, du = 3000) => {
    const alertEl = document.getElementById("alertEl");
    alertEl.innerHTML = msg;
    alertEl.classList.add("active");

    setTimeout(() => {
        alertEl.classList.remove("active");
    }, du);
};

var modalProduct = document.getElementById("Dom-modal-AddProduct");

function addModalProduct() {
    modalProduct.style.visibility = "visible";
    modalProduct.style.display = "flex";
}
function closeModalAddProduct() {
    modalProduct.style.visibility = "hidden";
    modalProduct.style.display = "none";
}

const apiUrl = "https://iti-js-project-backend.vercel.app/api/products/";
const productsList = document.getElementById("productsList");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.querySelector(".search");

async function fetchCategoriesForFilter() {
    try {
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const categories = await response.json();
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

async function fetchProducts(selectedCategory = "") {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch products");
        const products = await response.json();

        allProducts = products;

        displayProducts(selectedCategory, searchInput.value);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function displayProducts(selectedCategory = "", searchText = "") {
    const productCount = allProducts.length;
    const productCountElement = document.querySelector(".header span");
    if (productCountElement) {
        productCountElement.innerText = productCount;
    }

    productsList.innerHTML = "";

    const filteredProducts = allProducts.filter((product) => {
        const matchesCategory = !selectedCategory || (product.category && product.category._id === selectedCategory);
        const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    filteredProducts.forEach((product) => {
        const productRow = document.createElement("tr");

        productRow.innerHTML = `
                <td>
                    <div class="flex items-center">
                        <input type="checkbox" class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300">
                    </div>
                </td>
                <th scope="row"
                        class="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        <div class="flex items-center mr-3">
                            <img src="${product.mainImage}" alt="${product.name}">
                            ${product.name}
                        </div>
                    </th>
                <td><span class="bg-primary-100 ">${product.category?.name || "N/A"}</span></td>
                <td class="custom-td">
                    <div class="flex">
                        <div id="circle" class="${product.quantity < 100 ? "circlered" : "circlegreen"}"></div>
                        <span id="quantity">${product.quantity}</span>
                    </div>
                </td>
                <td>$${product.price}</td>
                <td>
                       ${
                           product.isFeatured
                               ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="green" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.468 5.97a.75.75 0 0 1 1.06 1.06l-4 4a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06L8 9.94l3.468-3.97z"/></svg>'
                               : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" class="bi bi-x-circle" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 8 8A8 8 0 0 0 8 0zm3.707 4.293a1 1 0 0 1 0 1.414L9.414 8l2.293 2.293a1 1 0 0 1-1.414 1.414L8 9.414l-2.293 2.293a1 1 0 1 1-1.414-1.414L6.586 8 4.293 5.707a1 1 0 1 1 1.414-1.414L8 6.586l2.293-2.293a1 1 0 0 1 1.414 0z"/></svg>'
                       }
                    </td>
                <td>${product.discount}%</td>
                <td>${new Date().toLocaleDateString()}</td>
                <td class="custom-tdd">
                            <div class="flex">
                                <button type="button" class="edit-button" data-drawer-target="drawer-update-product" data-id="${product._id}" 
                                   onclick="updateProduct('${product._id}')" data-drawer-show="drawer-update-product" aria-controls="drawer-update-product">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 -ml-0.5"
                                        viewbox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path
                                            d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                        <path fill-rule="evenodd"
                                            d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Edit
                                </button>
                                <button type="button" class="preview-button" data-id="${product._id}"
                                    data-drawer-target="drawer-read-product-advanced"
                                    data-drawer-show="drawer-read-product-advanced"
                                    aria-controls="drawer-read-product-advanced">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="currentColor"
                                        class="w-4 h-4 mr-2 -ml-0.5">
                                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" />
                                    </svg>
                                    Preview
                                </button>
                                <button type="button" class="delete-button" data-modal-target="delete-modal" data-id="${product._id}" onclick="deleteProduct('${product._id}')"

                                    data-modal-toggle="delete-modal">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 -ml-0.5"
                                        viewbox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                        <path fill-rule="evenodd"
                                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </td>
            `;
        productsList.appendChild(productRow);
    });
}

fetchCategoriesForFilter();
fetchProducts();

categoryFilter.addEventListener("change", function () {
    const selectedCategory = categoryFilter.value;
    displayProducts(selectedCategory, searchInput.value);
});

searchInput.addEventListener("input", function () {
    const searchText = searchInput.value;
    const selectedCategory = categoryFilter.value;
    displayProducts(selectedCategory, searchText);
});

async function fetchCategories() {
    try {
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/categories", {
            method: "GET",
        });
        if (!response.ok) {
            throw new Error("Failed to fetch categories");
        }
        const categories = await response.json();
        const categorySelect = document.getElementById("productCategory");
        categorySelect.innerHTML = "";
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}
fetchCategories();

document.getElementById("addProductForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("User not authenticated!");
        return;
    }

    const formData = new FormData();
    formData.append("name", document.getElementById("productName").value);
    formData.append("description", document.getElementById("productDescription").value);
    formData.append("price", document.getElementById("productPrice").value);
    formData.append("quantity", document.getElementById("productQuantity").value);
    formData.append("category", document.getElementById("productCategory").value);
    formData.append("isFeatured", document.getElementById("isFeatured").checked);

    const imgCover = document.getElementById("coverImage").files[0];
    if (imgCover) {
        formData.append("mainImage", imgCover);
    }

    const productImages = document.getElementById("productImages").files;
    for (let i = 0; i < productImages.length; i++) {
        formData.append("otherImages", productImages[i]);
    }

    fetch("https://iti-js-project-backend.vercel.app/api/products/", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    })
        .then((response) => response.json())
        .then((data) => {
            alertUser("Product added successfully!");
            document.getElementById("addProductForm").reset();
            closeModalAddProduct();
            fetchProducts();
        })
        .catch((error) => {
            console.error("Error adding product:", error);
            alert("Error adding product. Please try again.");
        });
});

function closeModalAddProduct() {
    document.getElementById("Dom-modal-AddProduct").style.display = "none";
}

var modalupdateProduct = document.getElementById("Dom-modal-updateProduct");

function updateModalProduct() {
    modalupdateProduct.style.visibility = "visible";
    modalupdateProduct.style.display = "flex";
}
function closeModalUpdateProduct() {
    modalupdateProduct.style.visibility = "hidden";
    modalupdateProduct.style.display = "none";
}

// Update Product Function
async function updateProduct(productId) {
    try {
        const modal = document.getElementById("Dom-modal-updateProduct");
        modal.style.visibility = "visible";
        modal.style.display = "flex";

        const productResponse = await fetch(`https://iti-js-project-backend.vercel.app/api/products/${productId}`);
        if (!productResponse.ok) throw new Error("Failed to fetch product details");
        const product = await productResponse.json();

        const categoriesResponse = await fetch("https://iti-js-project-backend.vercel.app/api/categories");
        if (!categoriesResponse.ok) throw new Error("Failed to fetch categories");
        const categories = await categoriesResponse.json();

        const categorySelect = document.getElementById("updateProductCategory");
        categorySelect.innerHTML = "";
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category._id;
            option.textContent = category.name;
            if (category._id === product.category?._id) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });

        document.getElementById("updateProductName").value = product.name;
        document.getElementById("updateProductDescription").value = product.description;
        document.getElementById("updateProductPrice").value = product.price;
        document.getElementById("updateProductQuantity").value = product.quantity;
        document.getElementById("updateIsFeatured").checked = product.isFeatured;

        document.getElementById("updateProductId").value = productId;
    } catch (error) {
        console.error("Error updating product:", error);
    }
}

document.getElementById("updateProductForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("User not authenticated!");
        return;
    }

    const productId = document.getElementById("updateProductId").value;
    const formData = new FormData();
    formData.append("name", document.getElementById("updateProductName").value);
    formData.append("description", document.getElementById("updateProductDescription").value);
    formData.append("price", document.getElementById("updateProductPrice").value);
    formData.append("quantity", document.getElementById("updateProductQuantity").value);
    formData.append("category", document.getElementById("updateProductCategory").value);
    formData.append("isFeatured", document.getElementById("updateIsFeatured").checked);

    try {
        const response = await fetch(`https://iti-js-project-backend.vercel.app/api/products/${productId}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to update product");

        alertUser("Product updated successfully!");
        closeModalUpdateProduct();
        fetchProducts();
    } catch (error) {
        console.error("Error updating product:", error);
        alert("Error updating product. Please try again.");
    }
});

function deleteProduct(productId) {
    const confirmation = confirm("Are you sure you want to delete this product?");
    if (!confirmation) return;

    const token = localStorage.getItem("token");
    if (!token) {
        alert("User not authenticated!");
        return;
    }

    fetch(`https://iti-js-project-backend.vercel.app/api/products/${productId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Failed to delete product");
            alert("Product deleted successfully!");
            fetchProducts();
        })
        .catch((error) => {
            console.error("Error deleting product:", error);
            alert("Error deleting product. Please try again.");
        });
}
