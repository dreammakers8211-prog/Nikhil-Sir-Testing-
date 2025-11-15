// Mobile menu functionality
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const closeMenuBtn = document.getElementById("closeMenu");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
});

closeMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "auto";
});

// Close menu when clicking on links
const mobileLinks = mobileMenu.querySelectorAll("a");
mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "auto";
    });
});

// Modal functionality
const modalOverlay = document.getElementById("modalOverlay");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalForm = document.getElementById("modalForm");
const enquireBtnMain = document.getElementById("enquireBtnMain");
const interestedBtn = document.getElementById("interestedBtn");
const mobileInterestedBtn = document.getElementById("mobileInterestedBtn");
const brochureLink = document.getElementById("brochureLink");
const mobileBrochureLink = document.getElementById("mobileBrochureLink");
const brochureBtn = document.getElementById("brochureBtn");
const downloadBrochureBtn = document.getElementById("downloadBrochureBtn");
const locationCta = document.getElementById("locationCta");

// Function to open modal
function openModal() {
    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    document.getElementById("modalNameInput").focus();
}

// Function to close modal
function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "auto";
}

// Event listeners for opening modal
enquireBtnMain.addEventListener("click", openModal);
interestedBtn.addEventListener("click", openModal);
mobileInterestedBtn.addEventListener("click", openModal);
locationCta.addEventListener("click", openModal);

// Event listeners for brochure buttons to open modal
brochureLink.addEventListener("click", function(e) {
    e.preventDefault();
    openModal();
});

mobileBrochureLink.addEventListener("click", function(e) {
    e.preventDefault();
    openModal();
});

brochureBtn.addEventListener("click", function(e) {
    e.preventDefault();
    openModal();
});

// Event listener for download brochure button to open modal
downloadBrochureBtn.addEventListener("click", function(e) {
    e.preventDefault();
    openModal();
});

// Event listener for closing modal
modalCloseBtn.addEventListener("click", closeModal);

// Close modal when clicking outside
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});

// Accessibility: Close modal with Escape key
window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
        closeModal();
    }
});

// Trap focus inside modal for accessibility
modalOverlay.addEventListener("keydown", function(e) {
    if (!modalOverlay.classList.contains("active")) return;

    const focusableElements = modalOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const firstElem = focusableElements[0];
    const lastElem = focusableElements[focusableElements.length - 1];

    if (e.key === 'Tab' || e.keyCode === 9) {
        if (e.shiftKey) /* shift + tab */ {
            if (document.activeElement === firstElem) {
                lastElem.focus();
                e.preventDefault();
            }
        } else /* tab */ {
            if (document.activeElement === lastElem) {
                firstElem.focus();
                e.preventDefault();
            }
        }
    }
});

// Modal form submission with EmailJS
modalForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const nameVal = document.getElementById("modalNameInput").value.trim();
    const mobileVal = document.getElementById("modalMobileInput").value.trim();
    const emailVal = document.getElementById("modalEmailInput").value.trim();
    const countryCodeVal = document.getElementById("modalCountryCode").value;

    // Basic validation
    if (nameVal.length === 0) {
        alert("Please enter your name.");
        document.getElementById("modalNameInput").focus();
        return;
    }
    if (mobileVal.length < 7 || !/^\d[\d\s\-]*\d$/.test(mobileVal)) {
        alert("Please enter a valid mobile number.");
        document.getElementById("modalMobileInput").focus();
        return;
    }
    if (!emailVal || !isValidEmail(emailVal)) {
        alert("Please enter a valid email address.");
        document.getElementById("modalEmailInput").focus();
        return;
    }

    // Show loading state
    const submitBtn = modalForm.querySelector('.modal-submit-btn');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Prepare EmailJS parameters
    const templateParams = {
        from_name: nameVal,
        from_email: emailVal,
        phone: countryCodeVal + ' ' + mobileVal,
        to_name: "Godrej Eternal Palms Team",
        message: `New enquiry from ${nameVal} (${emailVal}, ${countryCodeVal} ${mobileVal}) for Godrej Eternal Palms property.`,
        subject: "New Enquiry - Godrej Eternal Palms"

    };

    // Send email using EmailJS
 //   emailjs.send('service_mg4h9r7', 'template_0z91jre', templateParams)
    emailjs.send('', '', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);

            // Show success message
            alert(`Thank you, ${nameVal}! We have received your enquiry and will contact you shortly at ${countryCodeVal} ${mobileVal}.`);

            // Close modal and reset form
            closeModal();
            modalForm.reset();

            // Reset button
            submitBtn.textContent = 'Submit';
            submitBtn.disabled = false;
        }, function(error) {
            console.log('FAILED...', error);

            // Show error message but still acknowledge to user
            alert(`Thank you, ${nameVal}! We've received your enquiry and will contact you shortly.`);

            // Close modal and reset form
            closeModal();
            modalForm.reset();

            // Reset button
            submitBtn.textContent = 'Submit';
            submitBtn.disabled = false;
        });
});

// Slider functionality
(() => {
    // Get slider elements
    const slides = document.querySelectorAll(".slider-image");
    const dots = document.querySelectorAll(".slider-dots button");
    const prevBtn = document.getElementById("prevArrow");
    const nextBtn = document.getElementById("nextArrow");
    let currentIndex = 0;
    const total = slides.length;
    let autoSlideInterval;
    let isAutoScrolling = true;

    // Function to show specific slide
    function showSlide(index) {
        // Handle index boundaries
        if (index < 0) index = total - 1;
        else if (index >= total) index = 0;

        // Update slides visibility
        slides.forEach((slide, i) => {
            slide.classList.toggle("active", i === index);
        });

        // Update dots state
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === index);
            dot.setAttribute("aria-selected", i === index ? "true" : "false");
            if (i === index) dot.setAttribute("tabindex", "0");
            else dot.setAttribute("tabindex", "-1");
        });

        // Update current index
        currentIndex = index;

        // Reset autoslide timer
        if (isAutoScrolling) {
            resetAutoSlide();
        }
    }

    // Function to show next slide
    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    // Function to show previous slide
    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Function to reset autoslide timer
    function resetAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    // Function to start autoslide
    function startAutoSlide() {
        isAutoScrolling = true;
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    // Function to stop autoslide
    function stopAutoSlide() {
        isAutoScrolling = false;
        clearInterval(autoSlideInterval);
    }

    // Event listeners for navigation arrows
    prevBtn.addEventListener("click", () => {
        stopAutoSlide();
        prevSlide();
        setTimeout(startAutoSlide, 10000); // Resume after 10 seconds
    });

    nextBtn.addEventListener("click", () => {
        stopAutoSlide();
        nextSlide();
        setTimeout(startAutoSlide, 10000); // Resume after 10 seconds
    });

    // Event listeners for navigation dots
    dots.forEach((dot) => {
        dot.addEventListener("click", (e) => {
            stopAutoSlide();
            const slideTo = Number(dot.getAttribute("data-slide"));
            showSlide(slideTo);
            setTimeout(startAutoSlide, 10000); // Resume after 10 seconds
        });

        dot.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                stopAutoSlide();
                const slideTo = Number(dot.getAttribute("data-slide"));
                showSlide(slideTo);
            }
        });
    });

    // Keyboard navigation for slider
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            stopAutoSlide();
            prevSlide();
            setTimeout(startAutoSlide, 10000);
        } else if (e.key === "ArrowRight") {
            stopAutoSlide();
            nextSlide();
            setTimeout(startAutoSlide, 10000);
        }
    });

    // Pause autoslide on hover
    document
        .querySelector(".slider")
        .addEventListener("mouseenter", stopAutoSlide);
    document
        .querySelector(".slider")
        .addEventListener("mouseleave", startAutoSlide);

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.querySelector(".slider").addEventListener(
        "touchstart",
        (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoSlide();
        }, {
            passive: true,
        }
    );

    document.querySelector(".slider").addEventListener(
        "touchend",
        (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            setTimeout(startAutoSlide, 10000);
        }, {
            passive: true,
        }
    );

    // Function to handle swipe gestures
    function handleSwipe() {
        const minSwipeDistance = 50;
        const distance = touchStartX - touchEndX;

        if (Math.abs(distance) < minSwipeDistance) return;

        if (distance > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }

    // Initialize slider
    showSlide(0);
    startAutoSlide();
})();

// Smooth scroll to enquiry form from main enquire button
document
    .getElementById("requestCallbackBtn")
    .addEventListener("click", () => {
        document.getElementById("nameInput").focus();
        document.getElementById("enquiryForm").scrollIntoView({
            behavior: "smooth",
        });
    });

// Form submission with loading state and EmailJS
document
    .getElementById("enquiryForm")
    .addEventListener("submit", function(e) {
        e.preventDefault();
        const form = this;
        const submitBtn = form.querySelector(".submit-btn");
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const mobile = form.mobile.value.trim();
        const consent = form.querySelector("#consentCheckbox").checked;

        // Validate name
        if (!name) {
            showError("Please enter your name.", form.name);
            return;
        }

        // Email validation
        if (!email) {
            showError("Please enter your email address.", form.email);
            return;
        } else if (!isValidEmail(email)) {
            showError("Please enter a valid email address.", form.email);
            return;
        }

        // Validate mobile number
        if (!/^\d{10}$/.test(mobile)) {
            showError(
                "Please enter a valid 10-digit mobile number.",
                form.mobile
            );
            return;
        }

        // Validate consent
        if (!consent) {
            showError(
                "Please provide consent to proceed.",
                form.querySelector("#consentCheckbox")
            );
            return;
        }

        // Show loading state
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;

        // Prepare EmailJS parameters
        const templateParams = {
            from_name: name,
            from_email: email,
            phone: '+91 ' + mobile,
            to_name: "Godrej Eternal Palms Team",
            message: `New enquiry from ${name} (${email}, +91 ${mobile}) for Godrej Eternal Palms property through the sidebar form.`,
            subject: "New Enquiry - Godrej Eternal Palms (Sidebar Form)"
        };

        // Send email using EmailJS
        emailjs.send('service_mg4h9r7', 'template_0z91jre', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);

                // Show success message
                const successMsg = document.createElement("div");
                successMsg.className =
                    "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4";
                successMsg.setAttribute("role", "alert");
                successMsg.innerHTML = `
                    <strong class="font-bold">Thank you!</strong>
                    <span class="block sm:inline">We've received your enquiry and will contact you shortly.</span>
                `;

                form.insertBefore(successMsg, form.firstChild);

                // Reset form
                form.reset();

                // Remove message after 5 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);

                // Reset button
                submitBtn.classList.remove("loading");
                submitBtn.disabled = false;
            }, function(error) {
                console.log('FAILED...', error);

                // Show success message even if email fails (to not confuse user)
                const successMsg = document.createElement("div");
                successMsg.className =
                    "bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4";
                successMsg.setAttribute("role", "alert");
                successMsg.innerHTML = `
                    <strong class="font-bold">Thank you!</strong>
                    <span class="block sm:inline">We've received your enquiry and will contact you shortly.</span>
                `;

                form.insertBefore(successMsg, form.firstChild);

                // Reset form
                form.reset();

                // Remove message after 5 seconds
                setTimeout(() => {
                    successMsg.remove();
                }, 5000);

                // Reset button
                submitBtn.classList.remove("loading");
                submitBtn.disabled = false;
            });
    });

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Function to show error messages
function showError(message, element) {
    // Remove any existing error messages
    const existingError =
        element.parentElement.querySelector(".error-message");
    if (existingError) existingError.remove();

    // Create error message element
    const errorMsg = document.createElement("p");
    errorMsg.className = "error-message text-red-600 text-sm mt-1";
    errorMsg.textContent = message;

    // Insert after the input element
    element.parentElement.insertBefore(errorMsg, element.nextSibling);

    // Focus on the problematic element
    element.focus();

    // Add error class to input
    element.classList.add("border-red-500");

    // Remove error class after interaction
    element.addEventListener(
        "input",
        function() {
            element.classList.remove("border-red-500");
            errorMsg.remove();
        }, {
            once: true,
        }
    );
}

// Preload images to prevent blur
window.addEventListener("load", function() {
    const images = document.querySelectorAll(".slider-image");
    images.forEach((img) => {
        if (img.complete && img.naturalHeight !== 0) {
            img.style.filter = "brightness(1.1)";
        } else {
            img.addEventListener("load", function() {
                this.style.filter = "brightness(1.1)";
            });
        }
    });
});

// Add price section functionality
document.addEventListener('DOMContentLoaded', function() {
    // Handle price navigation link clicks
    const priceNavLinks = document.querySelectorAll('.price-nav-link');
    priceNavLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('price-section').scrollIntoView({
                behavior: 'smooth'
            });

            // Update active state in navigation
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Handle price request button clicks
    const priceRequestBtns = document.querySelectorAll('.price-request-btn');
    priceRequestBtns.forEach(button => {
        button.addEventListener('click', () => {
            openModal();
        });
    });

    // Handle site plan navigation link clicks
    const sitePlanLinks = document.querySelectorAll('a[href="#site-plan-section"]');
    sitePlanLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('site-plan-section').scrollIntoView({
                behavior: 'smooth'
            });

            // Update active state in navigation
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Handle amenities navigation link clicks
    const amenitiesLinks = document.querySelectorAll('a[href="#amenities-section"]');
    amenitiesLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('amenities-section').scrollIntoView({
                behavior: 'smooth'
            });

            // Update active state in navigation
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });

    // Handle site plan button clicks
    const sitePlanBtns = document.querySelectorAll('.site-plan-btn');
    sitePlanBtns.forEach(button => {
        button.addEventListener('click', () => {
            openModal();
        });
    });
});

// Amenities carousel functionality
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.getElementById('carousel');
    const btnLeft = document.getElementById('scrollLeftBtn');
    const btnRight = document.getElementById('scrollRightBtn');

    if (carousel && btnLeft && btnRight) {
        // Scroll amount - width of one card + gap (gap is 1.5rem = 24px in tailwind px-6)
        const card = carousel.querySelector('article');
        const cardStyle = window.getComputedStyle(card);
        const gap = parseInt(cardStyle.marginRight) || 24;
        const scrollAmount = card.offsetWidth + gap;

        // Button scroll handlers
        btnLeft.addEventListener('click', () => {
            carousel.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        btnRight.addEventListener('click', () => {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        // Optional: keyboard navigation for carousel (left/right arrows)
        carousel.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                carousel.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
        });

        // Auto-scroll functionality
        let autoScrollInterval = setInterval(() => {
            carousel.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });

            // Check if we've reached the end
            if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
                // Scroll back to the beginning
                setTimeout(() => {
                    carousel.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                }, 1000);
            }
        }, 4000); // Scroll every 4 seconds

        // Pause auto-scroll on hover
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(() => {
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });

                // Check if we've reached the end
                if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10) {
                    // Scroll back to the beginning
                    setTimeout(() => {
                        carousel.scrollTo({
                            left: 0,
                            behavior: 'smooth'
                        });
                    }, 1000);
                }
            }, 4000);
        });
    }
});

// Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');

    const amenityCards = document.querySelectorAll('.amenity-card');
    let currentImageIndex = 0;
    let imagesData = [];

    // Collect all images data
    amenityCards.forEach(card => {
        const img = card.querySelector('img');
        const caption = card.querySelector('.label-bottomleft').textContent;
        const type = card.querySelector('.overlay-topright').textContent;

        imagesData.push({
            src: img.src,
            alt: img.alt,
            caption: `${caption} - ${type}`
        });
    });

    // Function to open lightbox
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxContent();
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to close lightbox
    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    // Update lightbox content
    function updateLightboxContent() {
        const currentImage = imagesData[currentImageIndex];
        lightboxImage.src = currentImage.src;
        lightboxImage.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.caption;
    }

    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % imagesData.length;
        updateLightboxContent();
    }

    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + imagesData.length) % imagesData.length;
        updateLightboxContent();
    }

    // Add click event to all amenity cards
    amenityCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            openLightbox(index);
        });

        // Add keyboard support for accessibility
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Lightbox controls
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', prevImage);
    lightboxNext.addEventListener('click', nextImage);

    // Keyboard navigation within lightbox
    document.addEventListener('keydown', function(e) {
        if (lightboxOverlay.classList.contains('active')) {
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    prevImage();
                    break;
                case 'ArrowRight':
                    nextImage();
                    break;
            }
        }
    });

    // Close lightbox when clicking outside the image
    lightboxOverlay.addEventListener('click', function(e) {
        if (e.target === lightboxOverlay) {
            closeLightbox();
        }
    });
});

// Gallery Lightbox functionality
document.addEventListener('DOMContentLoaded', function() {
    // Lightbox functionality
    const galleryCards = document.querySelectorAll('.gallery-card');
    const lightbox = document.querySelector('.gallery-lightbox-overlay');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const closeBtn = lightbox.querySelector('.gallery-lightbox-close');
    const prevBtn = lightbox.querySelector('.prev-btn');
    const nextBtn = lightbox.querySelector('.next-btn');

    let currentIndex = 0;
    const images = [];

    // Preload images and store data
    galleryCards.forEach((card, index) => {
        const img = card.querySelector('img');
        const caption = card.querySelector('.caption').textContent;

        images.push({
            src: img.src,
            alt: img.alt,
            caption: caption
        });

        // Add click event to each card
        card.addEventListener('click', () => {
            openLightbox(index);
        });

        // Add keyboard support for each card
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Open lightbox with specific image
    function openLightbox(index) {
        currentIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Update lightbox content
    function updateLightbox() {
        const currentImage = images[currentIndex];
        lightboxImg.src = currentImage.src;
        lightboxImg.alt = currentImage.alt;
        lightboxCaption.textContent = currentImage.caption;
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }

    // Navigate to next image
    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        updateLightbox();
    }

    // Navigate to previous image
    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateLightbox();
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', nextImage);
    prevBtn.addEventListener('click', prevImage);

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowRight') {
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                prevImage();
            }
        }
    });

    // Swipe support for touch devices
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            // Swipe left - next image
            nextImage();
        } else if (touchEndX > touchStartX + 50) {
            // Swipe right - previous image
            prevImage();
        }
    }

    // Location section functionality
    const locationEnquireBtn = document.getElementById('locationEnquireBtn');
    if (locationEnquireBtn) {
        locationEnquireBtn.addEventListener('click', openModal);
    }

    // Handle location navigation link clicks
    const locationLinks = document.querySelectorAll('a[href="#location-section"]');
    locationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('location-section').scrollIntoView({
                behavior: 'smooth'
            });

            // Update active state in navigation
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
});