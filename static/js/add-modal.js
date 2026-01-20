document.addEventListener("DOMContentLoaded", () => {
  const recipeModal = document.getElementById("recipeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const recipeForm = document.getElementById("recipeForm");
  const toast = document.getElementById("toast");
  const header = document.querySelector("header");

// Event delegation: clicks anywhere in the document
document.body.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("recipeButton") || // "Add Your First Recipe"
    e.target.id === "openModalBtn"                // header "+ Add Recipe"
  ) {
    e.preventDefault();        // prevent default link behavior
    recipeModal.classList.remove("hidden");
    header.style.display = "none"; // hide header when modal is open
  }
});


  // Cancel button closes modal
  cancelBtn.addEventListener("click", () => {
    if (confirm("Discard changes?")) {
      recipeModal.classList.add("hidden");
      recipeForm.reset();
      header.style.display = ""; // show header when modal is closed
    }
  });

  // Submit form
  recipeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const fetchRes = await fetch("http://localhost:3002/recipes");
    const recipes = await fetchRes.json();
    
    const nextId = recipes.length > 0 
      ? Math.max(...recipes.map(r => parseInt(r.id) || 0)) + 1 
      : 1;
    const newRecipe = {
      id: String(nextId),
      name: document.getElementById("name").value,
      category: document.getElementById("category").value,
      difficulty: document.getElementById("difficulty").value,
      prepTime: Number(document.getElementById("prepTime").value),
      servings: Number(document.getElementById("servings").value),
      ingredients: document.getElementById("ingredients").value,
      instructions: document.getElementById("instructions").value,
      imageUrl: document.getElementById("imageUrl").value,
      createdAt: new Date().toISOString()
    };

    try {
      const res = await fetch("http://localhost:3002/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe)
      });

      if (!res.ok) throw new Error("Failed to add recipe");

      
      recipeModal.classList.add("hidden");
      recipeForm.reset();
      toast.classList.remove("hidden");
      header.style.display = ""; 
      setTimeout(() => toast.classList.add("hidden"), 3000);

      // Refresh recipes
      fetchAndRenderRecipes();
    } catch (err) {
      console.error(err);
    }
  });

});