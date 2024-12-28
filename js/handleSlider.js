/************************************************************
 * Reusable slider initialization function
 ************************************************************/
function initSlider({ containerSelector, slideData, leftArrowSelector, rightArrowSelector, autoSlideIntervalMs = 5000 }) {
    /************************************************************
     * 1) Create Slide Element
     ************************************************************/
    function createSlideElement(item) {
        const slideEl = document.createElement("div");
        slideEl.classList.add("slide");
        slideEl.innerHTML = `
        <div class="text-container">
            <h2>${item.title}</h2>
            <p>${item.description}</p>
            <button onclick="location.href='${item.link}'" class="offer-btn">
                Exclusive Offer
            </button>
        </div>
        <img src="${item.image}" alt="${item.title}" />
      `;
        return slideEl;
    }

    /************************************************************
     * 2) Render Slides + Clones
     ************************************************************/
    function renderSlides(data) {
        const sliderTrack = document.querySelector(`${containerSelector} .slider-track`);
        sliderTrack.innerHTML = "";

        // Clone last slide at the beginning
        const lastSlide = createSlideElement(data[data.length - 1]);
        sliderTrack.appendChild(lastSlide);

        // Original slides
        data.forEach((item) => {
            const slideEl = createSlideElement(item);
            sliderTrack.appendChild(slideEl);
        });

        // Clone first slide at the end
        const firstSlide = createSlideElement(data[0]);
        sliderTrack.appendChild(firstSlide);
    }

    /************************************************************
     * 3) Initialize the slider
     ************************************************************/
    renderSlides(slideData);

    const sliderTrack = document.querySelector(`${containerSelector} .slider-track`);
    const leftArrow = document.querySelector(leftArrowSelector);
    const rightArrow = document.querySelector(rightArrowSelector);

    let currentIndex = 1;
    let isTransitioning = false;
    let autoSlideInterval;

    // We'll store a restart timer here to prevent multiple timeouts
    let restartTimeout;

    /************************************************************
     * 4) Helper to get all .slide elements
     ************************************************************/
    function getSlides() {
        return document.querySelectorAll(`${containerSelector} .slide`);
    }

    /************************************************************
     * 5) Initialize position (start at the first real slide)
     ************************************************************/
    function initializePosition() {
        const slides = getSlides();
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth;
        sliderTrack.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }

    /************************************************************
     * 6) Handle resize
     ************************************************************/
    function handleResize() {
        const slides = getSlides();
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth;
        sliderTrack.style.transition = "none";
        sliderTrack.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    }

    /************************************************************
     * 7) Move to a specific slide
     ************************************************************/
    function moveToSlide(index) {
        const slides = getSlides();
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth;
        isTransitioning = true;
        sliderTrack.style.transition = "transform 0.5s ease-in-out";
        sliderTrack.style.transform = `translateX(-${slideWidth * index}px)`;
    }

    /************************************************************
     * 8) Next / Previous
     ************************************************************/
    function moveToNextSlide() {
        if (isTransitioning) return;
        currentIndex++;
        moveToSlide(currentIndex);
    }

    function moveToPreviousSlide() {
        if (isTransitioning) return;
        currentIndex--;
        moveToSlide(currentIndex);
    }

    /************************************************************
     * 9) Reset position (jump without transition)
     ************************************************************/
    function resetPosition(newIndex) {
        const slides = getSlides();
        if (!slides.length) return;
        const slideWidth = slides[0].offsetWidth;
        sliderTrack.style.transition = "none";
        sliderTrack.style.transform = `translateX(-${slideWidth * newIndex}px)`;
        currentIndex = newIndex;

        // Force reflow to apply transform without transition
        void sliderTrack.offsetWidth;
        sliderTrack.style.transition = "transform 0.5s ease-in-out";
    }

    /************************************************************
     * 10) Handle transition end (infinite loop logic)
     ************************************************************/
    sliderTrack.addEventListener("transitionend", (e) => {
        if (e.propertyName !== "transform") return;
        isTransitioning = false;

        const slides = getSlides();
        const totalSlides = slides.length;

        // If too far right (past the cloned first slide)
        if (currentIndex >= totalSlides - 1) {
            resetPosition(1);
        }

        // If too far left (past the cloned last slide)
        if (currentIndex <= 0) {
            resetPosition(totalSlides - 2);
        }
    });

    /************************************************************
     * 11) Auto-slide
     ************************************************************/
    function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
            moveToNextSlide();
        }, autoSlideIntervalMs);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Not strictly required now, but still useful if needed
    function resetAutoSlide() {
        stopAutoSlide();
        startAutoSlide();
    }

    /************************************************************
     * 12) Arrow events with Debounce for the restart
     ************************************************************/
    function scheduleAutoSlideRestart() {
        if (restartTimeout) {
            clearTimeout(restartTimeout);
        }
        // Wait 1 second less than the autoSlideIntervalMs
        // so the user can see the transition before the next auto move
        restartTimeout = setTimeout(() => {
            startAutoSlide();
        }, autoSlideIntervalMs - 1000);
    }

    leftArrow.addEventListener("click", () => {
        stopAutoSlide();
        moveToPreviousSlide();
        scheduleAutoSlideRestart();
    });

    rightArrow.addEventListener("click", () => {
        stopAutoSlide();
        moveToNextSlide();
        scheduleAutoSlideRestart();
    });

    /************************************************************
     * 13) Final init
     ************************************************************/
    initializePosition();
    startAutoSlide();
    window.addEventListener("resize", handleResize);
}

/************************************************************
 * Example usage
 ************************************************************/
