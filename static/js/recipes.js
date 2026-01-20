const API_URL = "http://localhost:3002";

// Select DOM elements
const recipeListContainer = document.getElementById("recipes-list");
const searchInput = document.getElementById("searchInput");
const loadingElement = document.querySelector(".loading");
const notFoundRecipe = document.querySelector(".notFound");
const filterButton = document.querySelectorAll(".filter-btn");
const sortDown = document.querySelector("#sortBy");

// Variable to store all recipes
let allRecipes = [];

//function to create html for recipes
const renderRecipes = (recipes) => {
  recipeListContainer.innerHTML = "";

  recipes.forEach(recipe => {
    const card = document.createElement("div");

    card.className =
      "recipe-cards bg-white rounded-xl shadow-md hover:shadow-lg transition p-3";

    card.innerHTML = `
    <div class="image-wrapper">
        <img 
        src="${recipe.imageUrl}" 
        alt="${recipe.name}" 
        class="recipe-image"
        />
    </div>

    <div class="card-header">
        <h3 class="recipe-title">${recipe.name} </h3>
        <span class="category-badge">${recipe.category} </span>
    </div>

    <span class="difficulty-label ${recipe.difficulty}">${recipe.difficulty} </span>

    <div class="card-footer">
        <div class="meta">
            <i class="fa-duotone fa-solid fa-stopwatch"></i> ${recipe.prepTime} mins
        </div>
        <div class="meta">
            <i class="fa-solid fa-utensils"></i> ${recipe.servings} servings
        </div>
    </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `recipe-details.html?id=${recipe.id}`;
    });

    recipeListContainer.appendChild(card);
  });
};

//function to fetch and render recipes
const fetchAndRenderRecipes = async () => {
  try {
    showLoading(); // Show loading indicator before fetching data
    const res = await fetch(`${API_URL}/recipes`);
    const recipes = await res.json();

    allRecipes = recipes;
    renderRecipes(allRecipes); //render all recipes if fetch is successful
  } catch (err) {
    console.error("Failed to load recipes", err);
  } finally {
    hideLoading(); // Hide loading indicator after data is fetched or on error
  }
  
};

//search function for the recipes
const handleSearch = () => {
  const query = searchInput.value.toLowerCase();
    const filteredRecipes = allRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(query)
    );

    // Show or hide the "not found" message based on search results
    if (filteredRecipes.length === 0) {
        recipeListContainer.classList.add("hidden");
        notFoundRecipe.classList.remove("hidden");
    } else {
        recipeListContainer.classList.remove("hidden");
        notFoundRecipe.classList.add("hidden");
        renderRecipes(filteredRecipes);
    }
    
};

// Clear input only when Enter is pressed
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchInput.value = ""; // clear input
  }
});

// event listener for search input
searchInput.addEventListener("input", handleSearch);

//loading function when fetching data
const showLoading = () => {
  loadingElement.classList.add("active");
};

//hide loading function after data is fetched
const hideLoading = () => {
  loadingElement.classList.remove("active");
};

//filter function for the recipes
const filterByCategory = (category) => {
  let filteredRecipes;

  if (category.toLowerCase() === "all") {
    // Show all recipes
    filteredRecipes = allRecipes;
  } else {
    // Filter recipes dynamically based on category
    filteredRecipes = allRecipes.filter(
      recipe => recipe.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Show "No Recipes Found" if nothing matches
  if (filteredRecipes.length === 0) {
    recipeListContainer.classList.add("hidden");
    notFoundRecipe.classList.remove("hidden");
  } else {
    recipeListContainer.classList.remove("hidden");
    notFoundRecipe.classList.add("hidden");
    renderRecipes(filteredRecipes);
  }
};


//event listener for the filter dropdown
filterButton.forEach(button => {
    button.addEventListener("click", () => {

        //remove active class from all buttons
        filterButton.forEach(btn => btn.classList.remove("active"));

        //add active class to clicked button
        button.classList.add("active");

        //filter recipes based on selected category
        filterByCategory(button.dataset.category); //dataset is builtin in javascript to access data attributes

    });
});

//sort function for the recipes
const sortRecipes = (criteria) => {
    let sortedRecipes = [...allRecipes]; //create a copy of allRecipes to avoid mutating the original array

    //sort based on criteria using switch case
    sortedRecipes.sort((a, b) => {
        switch (criteria) {
            case "date-newest":
                return new Date(b.createdAt) - new Date(a.createdAt); //sort by newest date
            case "date-oldest":
                return new Date(a.createdAt) - new Date(b.createdAt);
            case "name-az":
                return a.name.localeCompare(b.name);
            case "name-za":
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    renderRecipes(sortedRecipes); //render sorted recipes
}; 

//event listener for sort dropdown
sortDown.addEventListener("change", () => {
    sortRecipes(sortDown.value);
});


//event listener for search input
searchInput.addEventListener("input", handleSearch);
// Initial fetch and render of recipes on page load
window.addEventListener("DOMContentLoaded", fetchAndRenderRecipes);
