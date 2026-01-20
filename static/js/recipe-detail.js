
const BASE_URL = "http://localhost:3002";         
const recipeImg = document.getElementById("recipe-img");
const complexityBadge = document.querySelector(".complexity-badge");
const categoryText = document.getElementById("category-text");
const dateCreated = document.getElementById("date-created");
const recipeName = document.getElementById("recipe-name");
const prepTime = document.getElementById("prep-time");
const servingNumber = document.getElementById("serving-number");
const commentNumber = document.getElementById("comment-number");
const ingredientsBtn = document.getElementById("ingredients");
const instructionsBtn = document.getElementById("instructions");
const commentsBtn = document.getElementById("comments");
const dynamicIngredients = document.getElementById("dynamic-ingredients");
const dynamicInstructions = document.getElementById("dynamic-instructions");
const dynamicComments = document.getElementById("dynamic-comments");
const authorComment = document.getElementById("textarea-comment");
const authorName = document.getElementById("reviewer");
const authorPush = document.getElementById("post-comment");
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");
const panels = document.querySelectorAll('.tab-panel');
const commentLists = document.getElementById('comment-lists');

const capitalize = s => s && s[0].toUpperCase() + s.slice(1);


fetch(`${BASE_URL}/recipes`)
    .then(res => res.json())
    .then(data => {
    
    const recipe = data.find(r => Number(r.id) === Number(recipeId));
    populateRecipe(recipe);
    })
    .catch(err => console.error("Error loading recipe:", err));

fetch(`${BASE_URL}/comments`)
    .then(res => res.json())
    .then(comments =>{
        const comment = comments.filter(comment => comment.recipeId === Number(recipeId));
        commentCount(comment)
    })
    .catch(err => console.error("Error loading comment:", err));
   
function commentCount(comment){
  commentNumber.textContent = comment.length
};


function populateRecipe(recipe) {
    // Image
    recipeImg.src = recipe.imageUrl;
    recipeImg.alt = recipe.name;
    document.title = `${recipe.name} Details`
    // Difficulty badge
    complexityBadge.textContent = capitalize(recipe.difficulty);
    // Category & Date
    categoryText.textContent = capitalize(recipe.category);
    dateCreated.textContent = formatDate(recipe.createdAt);

    // Title
    recipeName.textContent = recipe.name;

    // Stats
    prepTime.textContent = `${recipe.prepTime} mins`;
    servingNumber.textContent = recipe.servings;
    
    const actionBtnsContainer = document.querySelector(".action-btns-container");
    const actionButtons = actionBtnsContainer.querySelectorAll("button");
    
    actionButtons.forEach(btn =>
        btn.addEventListener('click', () => {
    /* 1. button states */
            actionButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            /* 2. panel states – hide all first */
            panels.forEach(p => p.classList.remove('active'));

            /* 3. show the right panel – defer until next tick */
            setTimeout(() => {          // ← guarantees the DOM has settled
                if (btn.id === 'ingredients')  {
                    dynamicIngredients.classList.add('active');
                    renderIngredients(recipe.ingredients);
                }
                if (btn.id === 'instructions') {
                    dynamicInstructions.classList.add('active');
                    renderInstructions(recipe.instructions);
                }
                if (btn.id === 'comments') {
                    dynamicComments.classList.add('active');
                }
            }, 0);
        })
        );
    };



// ===== HELPERS =====
function renderIngredients(ingredients) {
    const items = ingredients
    .split("\n")
    .map(step => step.replace(/^\d+\.\s*/, ""));

    dynamicIngredients.innerHTML = `
    <div class="name-underline">
        <h3>Ingredients</h3>
    </div>
    <ul>
        ${items.map(item => `<li> <span>✓ </span>${item}</li>`).join("")}
    </ul>
    `;
    const listItems = document.querySelectorAll('.dynamic-ingredients ul li');

    listItems.forEach(li => {
      li.addEventListener('click', () => {
        listItems.forEach(item => item.classList.remove('active'));
        li.classList.add('active');
      });
    });
}


function renderInstructions(instructions) {
    const steps = instructions
    .split("\n")
    .map(step => step.replace(/^\d+\.\s*/, ""));
    dynamicInstructions.innerHTML = `
        <div class="name-underline">
            <h3>Instructions</h3>
        </div>
    <ol class="instructions-list">
        ${steps.map(step => `<li>${step}</li>`).join("")}
    </ol>
    `;
}





function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
    });
}

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



function postComment() {
  const form = document.querySelector('.dynamic-comments form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    e.stopPropagation();              
    const fetchComments = await fetch(`${BASE_URL}/comments`);
    const comments = await fetchComments.json();
    
    const commentId = comments.length > 0 
      ? Math.max(...comments.map(r => parseInt(r.id) || 0)) + 1 
      : 1;

    const payload = {
      id: String(commentId),
      recipeId: Number(recipeId),
      author: authorName.value.trim(),
      text: authorComment .value.trim(),
      createdAt: new Date().toISOString()
    };

    if (!payload.author || !payload.text) return;

    authorPush.disabled = true;
    authorPush.textContent = 'Posting…';

    try {
      const res = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
        
      });
    
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json(); 
            
      authorName.value = '';
      authorComment.value   = '';
      commentsBtn.classList.add('active');
      dynamicComments.classList.add('active');
      appendComment(data);


      
      setTimeout(() => {
        commentLists.classList.remove('active');
      }, 2 * 60 * 1000);
                
    } catch (err) {
      alert('Could not post comment. Try again.');
      console.error(err);
    } finally {
      authorPush.disabled = false;
      authorPush.textContent = 'Post Comment';
    }
  });
}
   
function commentCount(comment){
  commentNumber.textContent = comment.length
};

function appendComment(comment) {
  const list = document.getElementById('commentsList');

  const div = document.createElement('div');
  div.className = 'comment-item';
  div.innerHTML = `
    <strong>${comment.author}</strong>
    <p>${comment.text}</p>
    <small>${new Date(comment.createdAt).toLocaleString()}</small>
  `;

  commentLists.prepend(div);   // newest on top
  commentLists.classList.add('active');
}


postComment();