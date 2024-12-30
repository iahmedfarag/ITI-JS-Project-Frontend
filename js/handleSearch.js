import { products } from "./variables.js";

const handleSearch = (value) => {
    let result = [];
    products.map((product) => {
        if (product.name && product.name.toLowerCase().includes(value.toLowerCase())) {
            result.push(product);
        }
    });
    return result;
};

export const handleDisplaySearchResult = (value, resultElement) => {
    if (value === "") {
        resultElement.style.display = "none";
        resultElement.innerHTML = "";
        return;
    }
    const searchProductsResult = handleSearch(value);
    const searchProductsResultHTML =
        searchProductsResult.length > 0
            ? searchProductsResult
                  .slice(0, 5)
                  .map(
                      (prd) =>
                          `<a href="/shop/${prd._id}" target="_blank" class="product">
                      <div>
                          <img src="${prd.mainImage}" alt="product" />
                          <p class="title">${prd.name}</p>
                      </div>
                      <p class="price">${prd.price}$</p>
                  </a>`
                  )
                  .join("")
            : "nothing to show";
    resultElement.style.display = "flex";
    resultElement.innerHTML = searchProductsResultHTML;
};

export const handleSearchBlur = (el) => {
    el.style.display = "none";
    el.innerHTML = "";
};
