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

        console.log(result);

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
        console.log(result);

        return result;
    } catch (error) {
        console.error("Error posting data:", error.message);
        throw error;
    }
};
