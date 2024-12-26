const sliderTrack = document.querySelector(".slider-track");
const slides = document.querySelectorAll(".slide");
let slideWidth = slides[0].offsetWidth; // Dynamic width
let currentIndex = 0;

// Clone first and last slides for infinite effect
const firstSlideClone = slides[0].cloneNode(true);
const lastSlideClone = slides[slides.length - 1].cloneNode(true);

sliderTrack.appendChild(firstSlideClone);
sliderTrack.insertBefore(lastSlideClone, slides[0]);

// Adjust initial position
sliderTrack.style.transform = `translateX(-${slideWidth}px)`;

// Recalculate slide width on resize
window.addEventListener("resize", () => {
    slideWidth = slides[0].offsetWidth; // Update width
    sliderTrack.style.transition = "none";
    sliderTrack.style.transform = `translateX(-${slideWidth * (currentIndex + 1)}px)`;
});

function moveToNextSlide() {
    currentIndex++;
    sliderTrack.style.transition = "transform 0.5s ease-in-out";
    sliderTrack.style.transform = `translateX(-${slideWidth * (currentIndex + 1)}px)`;

    sliderTrack.addEventListener("transitionend", () => {
        if (currentIndex === slides.length) {
            currentIndex = 0;
            sliderTrack.style.transition = "none";
            sliderTrack.style.transform = `translateX(-${slideWidth}px)`;
        }
    });
}

function moveToPreviousSlide() {
    currentIndex--;
    sliderTrack.style.transition = "transform 0.5s ease-in-out";
    sliderTrack.style.transform = `translateX(-${slideWidth * (currentIndex + 1)}px)`;

    sliderTrack.addEventListener("transitionend", () => {
        if (currentIndex < 0) {
            currentIndex = slides.length - 1;
            sliderTrack.style.transition = "none";
            sliderTrack.style.transform = `translateX(-${slideWidth * slides.length}px)`;
        }
    });
}

// Use requestAnimationFrame for smooth and consistent behavior
let lastTimestamp = 0;
const intervalDuration = 3000; // 3 seconds
function sliderLoop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;

    const elapsed = timestamp - lastTimestamp;
    if (elapsed >= intervalDuration) {
        moveToNextSlide();
        lastTimestamp = timestamp;
    }

    requestAnimationFrame(sliderLoop);
}

// Start the slider loop
requestAnimationFrame(sliderLoop);
