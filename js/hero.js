const heroSlideData = [
    {
        title: "Comfortable Chair",
        description: "Teal Cushion for style and comfort. Perfect for home and office use.",
        image: "./public/cat (1).jpg",
        link: "/products/teal-chair",
    },
    {
        title: "Stylish Chair",
        description: "Red Cushion for a bold look. Add elegance to your space.",
        image: "./public/cat (2).jpg",
        link: "/products/red-chair",
    },
    {
        title: "Modern Chair",
        description: "Orange Cushion for a vibrant style. A must-have for modern interiors.",
        image: "./public/cat (3).jpg",
        link: "/products/orange-chair",
    },
];
initSlider({
    containerSelector: ".hero",
    slideData: heroSlideData,
    leftArrowSelector: ".hero .left-arrow",
    rightArrowSelector: ".hero .right-arrow",
    autoSlideIntervalMs: 5000,
});
