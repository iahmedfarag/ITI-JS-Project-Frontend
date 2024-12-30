import { initSlider } from "./handleSlider.js";

const heroSlideData = [
    {
        title: "Comfortable Chair",
        description: "Teal Cushion for style and comfort. Perfect for home and office use.",
        image: "./public/cat (1).jpg",
        link: "../pages/products/index.html",
    },
    {
        title: "Stylish Chair",
        description: "Red Cushion for a bold look. Add elegance to your space.",
        image: "./public/cat (2).jpg",
        link: "../pages/products/index.html",
    },
    {
        title: "Modern Chair",
        description: "Orange Cushion for a vibrant style. A must-have for modern interiors.",
        image: "./public/cat (3).jpg",
        link: "../pages/products/index.html",
    },
];

initSlider({
    containerSelector: ".hero",
    slideData: heroSlideData,
    leftArrowSelector: ".hero .left-arrow",
    rightArrowSelector: ".hero .right-arrow",
    autoSlideIntervalMs: 5000,
});
