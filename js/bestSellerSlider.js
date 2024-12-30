import { initSlider } from "./handleSlider.js";

const bestSellerSliderData = [
    {
        title: "Comfortable Chair",
        description: "Teal Cushion for style and comfort. Perfect for home and office use.",
        image: "./public/bestseller2.png",
        link: "/products/teal-chair",
    },
    {
        title: "Stylish Chair",
        description: "Red Cushion for a bold look. Add elegance to your space.",
        image: "./public/bestseller1.png",
        link: "/products/red-chair",
    },
    {
        title: "Modern Chair",
        description: "Orange Cushion for a vibrant style. A must-have for modern interiors.",
        image: "./public/bestseller3.png",
        link: "/products/orange-chair",
    },
];
initSlider({
    containerSelector: ".bestSellerSlider",
    slideData: bestSellerSliderData,
    leftArrowSelector: ".bestSellerSlider .left-arrow",
    rightArrowSelector: ".bestSellerSlider .right-arrow",
    autoSlideIntervalMs: 5000,
});
