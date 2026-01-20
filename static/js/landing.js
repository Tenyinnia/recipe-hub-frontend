//API URL 
const API_URL = "http://localhost:3002";

// Global variables
let currentSlide = 0;
let recipes = [];

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    loadHeroImage(); // Load hero image from API
    loadCarousel(); // Load carousel from API
    setupCarouselAutoAdvance(); // Start auto-advance
    setupFAQ(); // Initialize FAQ accordion
    loadStats(); // Load and display stats
});

// Function to load hero image from API (first recipe with id 1)
async function loadHeroImage() {
    try {
        // Fetch the first recipe (id: 1) from API
        const response = await fetch(`${API_URL}/recipes/4`);
        const recipe = await response.json();

        // Update hero image
        const heroImg = document.querySelector('.hero-container img');
        if (heroImg && recipe.imageUrl) {
            heroImg.src = recipe.imageUrl;
            heroImg.alt = recipe.name;
        }
    } catch (error) {
        console.error('Error loading hero image:', error);
    }
}

// Function to load carousel from API
async function loadCarousel() {
    try {
        // Fetch recipes from API
        const response = await fetch(`${API_URL}/recipes`);
        recipes = await response.json();

        // Get carousel wrapper
        const carouselWrapper = document.querySelector('.carousel-wrapper');
        if (!carouselWrapper) return;

        // Clear existing slides
        carouselWrapper.innerHTML = '';

        // Create slides for first 5 recipes
        const recipesToShow = recipes.slice(0, 5);
        
        recipesToShow.forEach((recipe, index) => {
            const slide = createCarouselSlide(recipe, index, recipesToShow.length);
            carouselWrapper.appendChild(slide);
        });

        // Show first slide
        showSlide(0);
    } catch (error) {
        console.error('Error loading carousel:', error);
    }
}

// Function to create a carousel slide
function createCarouselSlide(recipe, index, totalSlides) {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    if (index === 0) slide.classList.add('active');

    // Get first instruction line
    const firstInstruction = recipe.instructions.split('\n')[0];

    // Create dots HTML
    let dotsHTML = '';
    for (let i = 0; i < totalSlides; i++) {
        dotsHTML += `<span class="dot ${i === index ? 'active' : ''}" onclick="showSlide(${i})"></span>`;
    }

    slide.innerHTML = `
        <img src="${recipe.imageUrl}" alt="${recipe.name}">
        <div class="carousel-overlay">
            <h3>${recipe.name}</h3>
            <div class="carousel-meta">
                <span><i class="fas fa-tag"></i> ${capitalizeFirstLetter(recipe.category)}</span>
                <span><i class="fas fa-clock"></i> ${recipe.prepTime} min</span>
                <span><i class="fas fa-users"></i> ${recipe.servings} servings</span>
            </div>
            <p>${firstInstruction}</p>
            <div class="carousel-dots">
                ${dotsHTML}
            </div>
        </div>
        <button class="carousel-btn prev" onclick="changeSlide(-1)"><i class="fas fa-chevron-left"></i></button>
        <button class="carousel-btn next" onclick="changeSlide(1)"><i class="fas fa-chevron-right"></i></button>
    `;

    return slide;
}

// Function to show a specific slide
function showSlide(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));

    // Update current slide index
    currentSlide = index;
    
    // Add active class to current slide
    slides[currentSlide].classList.add('active');

    // Update dots in the active slide
    const activeSlideDots = slides[currentSlide].querySelectorAll('.dot');
    activeSlideDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentSlide);
    });
}

// Function to change slide
function changeSlide(direction) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;

    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    showSlide(currentSlide);
}

// Function to setup auto-advance carousel
function setupCarouselAutoAdvance() {
    setInterval(() => {
        changeSlide(1);
    }, 5000);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// FAQ Setup Function
function setupFAQ() {
    // Select all FAQ items
    const faqItems = document.querySelectorAll('.faq-item');

    // Add click event listener to each FAQ question    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question'); // Select the question element

        // Toggle active class on click
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active'); // Check if the item is already active

            faqItems.forEach(i => i.classList.remove('active')); // Close all FAQ items by removing 'active' class

            if (!isActive) {
                item.classList.add('active'); // Open the clicked FAQ item by adding 'active' class
            }
        });
    });
}

// Function to load stats from API
async function loadStats() {
    try {
        // Stats elements
        const statsRecipe = document.querySelector('.stats-recipe');
        const statsUser = document.querySelector('.stats-user');
        const statCategory = document.querySelector('.stat-category');
        const statsComments = document.querySelector('.stats-comments');

        // Fetch recipes data from API
        const response = await fetch(`${API_URL}/recipes`);
        const recipes = await response.json(); // Convert response to JSON

        // Recipes count
        if (statsRecipe) {
            statsRecipe.textContent = recipes.length;
        }

        // Fetch comments data from API
        const commentsResponse = await fetch(`${API_URL}/comments`);
        const comments = await commentsResponse.json(); // Convert response to JSON

        // Comments count
        if (statsComments) {
            statsComments.textContent = comments.length;
        }

        // Fetch User Count from comments in json
        const users = [];
        comments.forEach(comment => {
            // If the user is not already in the users array, add them
            if (!users.includes(comment.author)) {
                users.push(comment.author);
            }
        });
        if (statsUser) {
            statsUser.textContent = users.length;
        }

        // Fetch categories from recipes
        const categories = [];
        recipes.forEach(recipe => {
            // If the category is not already in the categories array, add it
            if (!categories.includes(recipe.category)) {
                categories.push(recipe.category);
            }
        });
        if (statCategory) {
            statCategory.textContent = categories.length;
        }

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Menu Toggle
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');

if (toggle && nav) {
    toggle.addEventListener('click', () => {
        nav.classList.toggle('open');
    });
}

// Page Navigation
function showPage(pageName) {
    // Update active nav link
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });
}
