🍽️ RecipeHub — Frontend Recipe Management Platform

RecipeHub is a frontend-focused recipe discovery and management web application built to strengthen my practical skills in HTML, CSS, and modern JavaScript through real-world features and REST API integration.

This project demonstrates how a complete frontend application behaves — from UI interactions and state management to asynchronous data handling and responsive design.

🚀 Project Purpose

This project was built to:

Practice real-world frontend workflows

Master DOM manipulation and async JavaScript

Work with REST APIs (CRUD operations)

Build reusable UI components

Improve responsive layouts and UX patterns

Prepare for professional frontend / full-stack roles

🧩 Core Features
🏠 Landing Page

Animated hero section with CTA

Auto-playing featured recipes carousel

Dynamic platform statistics

Accordion-based “How it works” section

Newsletter subscription form

🍳 Recipes Page

Real-time search with debouncing

Category-based filtering (9 categories)

Sorting (date & alphabetical)

Recipe grid layout

Add Recipe modal with multi-step instructions

Toast notifications and loading states

📖 Recipe Details Page

Full recipe breakdown (ingredients, steps, comments)

Tab-based navigation

Styled ingredient checklist

Comment system with timestamps

Related recipes by category

Recipe deletion with confirmation

🛠️ Tech Stack

HTML5 — semantic structure

CSS3 — Flexbox, Grid, responsive layouts

JavaScript (ES6+)

Fetch API

Async / Await

DOM manipulation

State handling

JSON Server — mock REST API

📡 API Endpoints Used
GET    /recipes
POST   /recipes
GET    /recipes/:id
DELETE /recipes/:id

GET    /comments
GET    /comments?recipeId=:id
POST   /comments
DELETE /comments/:id

⚙️ Local Setup Instructions
1️⃣ Install JSON Server
npm install -g json-server

2️⃣ Start the API
json-server --watch db.json --port 3002

3️⃣ Run the App

Open index.html with Live Server

App runs at http://127.0.0.1:5500

📁 Project Structure
recipehub-frontend/
│
├── index.html
├── recipes.html
├── recipe-details.html
│
├── css/
│   └── styles.css
│
├── js/
│   ├── api.js
│   ├── recipes.js
│   ├── recipe-details.js
│   └── ui-components.js
│
├── db.json
└── README.md

🎯 Skills Demonstrated

REST API integration (CRUD)

Debounced search & filtering logic

Dynamic UI rendering

Modal, carousel, accordion, toast components

Responsive design for mobile & desktop

Error handling and loading states

Clean, maintainable frontend structure

🧠 Key Learnings

Managing application state without frameworks

Structuring frontend code for scalability

Handling user input and validation

Coordinating multiple API resources

Improving UX with feedback and animations

🔮 Planned Enhancements

Edit recipe functionality

User authentication

Recipe ratings

Image uploads

Ingredient-based search

Print/share recipes

👤 Author

Enyinnia Clifford
Full Stack Developer
Built as part of continuous learning and portfolio development.

📜 License

Educational use only — Tecvision Frontend Cohort 2025