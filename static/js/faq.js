//API URL 
const API_URL = "http://localhost:3002";

// Event listener for DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    setupFAQ(); // Initialize FAQ accordion
    loadStats(); // Load and display stats
});

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

// Stats elements
const statsRecipe = document.querySelector('.stats-recipe');
const statsUser = document.querySelector('.stats-user');
const statCategory = document.querySelector('.stat-category');
const statsComments = document.querySelector('.stats-comments');
 
//function to load stats from API
async function loadStats() {
    try {
        //fetch recipes data from API
        const response = await fetch(`${API_URL}/recipes`);
        const recipes = await response.json(); //convert response to JSON

        //recipes count
        statsRecipe.textContent = recipes.length;

        //fetch comments data from API
        const commentsResponse = await fetch(`${API_URL}/comments`);
        const comments = await commentsResponse.json(); //convert response to JSON

        //comments count
        statsComments.textContent = comments.length;

        //fetch User Count from comments in json
        const users = [];
        comments.forEach(comment => {
            //if the user is not already in the users array, add them
            if (!users.includes(comment.author)) {
                users.push(comment.author);
            }
        });
        statsUser.textContent = users.length;

        //fetch categories from recipes
        const categories = [];
        recipes.forEach(recipe => {
            //if the category is not already in the categories array, add it
            if (!categories.includes(recipe.category)) {
                categories.push(recipe.category);
            }
        });
        statCategory.textContent = categories.length;

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}
