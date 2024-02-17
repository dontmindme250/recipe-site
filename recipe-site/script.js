let currentSearch = {
  query: '',
  dietFilter: '',
  healthFilter: '',
  from: 0,
  to: 10
};

function updateCurrentSearch(query, dietFilter, healthFilter) {
  currentSearch.query = query;
  currentSearch.dietFilter = dietFilter;
  currentSearch.healthFilter = healthFilter;
}

function searchRecipes() {
  const query = document.getElementById('searchInput').value.trim();
  const dietFilter = document.getElementById('dietFilter').value;
  const healthFilter = document.getElementById('healthFilter').value;

  if (currentSearch.query !== query || currentSearch.dietFilter !== dietFilter || currentSearch.healthFilter !== healthFilter) {
    currentSearch.from = 0;
    currentSearch.to = 10;
    updateCurrentSearch(query, dietFilter, healthFilter);
  }

  const appId = ' '; // your edamam app id
  const appKey = ' '; // your edamam app key

  let apiUrl = `https://api.edamam.com/search?q=${currentSearch.query}&app_id=${appId}&app_key=${appKey}&from=${currentSearch.from}&to=${currentSearch.to}`;
  if (currentSearch.dietFilter) apiUrl += `&diet=${currentSearch.dietFilter}`;
  if (currentSearch.healthFilter) apiUrl += `&health=${currentSearch.healthFilter}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      displayRecipes(data.hits); 
      updatePaginationControls();
    })
    .catch(error => console.error('Error:', error));
}

function updatePaginationControls() {
  const paginationDiv = document.querySelector('.pagination-controls');
  paginationDiv.innerHTML = '';

  if (currentSearch.from > 0) {
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.addEventListener('click', () => {
      currentSearch.from -= 10;
      currentSearch.to -= 10;
      searchRecipes();
    });
    paginationDiv.appendChild(prevBtn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.addEventListener('click', () => {
    currentSearch.from += 10;
    currentSearch.to += 10;
    searchRecipes();
  });
  paginationDiv.appendChild(nextBtn);
}


document.querySelector('.search-box button').addEventListener('click', searchRecipes);

function toggleShoppingList(recipe) {
  const shoppingList = document.querySelector('.shopping-list ul');
  const ingredients = recipe.ingredientLines;

  if (shoppingList.innerHTML.trim() === '') {
    ingredients.forEach(ingredient => {
      const listItem = document.createElement('li');
      listItem.textContent = ingredient;
      shoppingList.appendChild(listItem);
    });
  } else {
    shoppingList.innerHTML = '';
  }
}

function displayRecipes(hits) {
  const recipesGrid = document.querySelector('.recipes-grid');
  recipesGrid.innerHTML = '';

  hits.forEach(hit => {
    const recipe = hit.recipe;
    const recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe';
    recipeDiv.innerHTML = `
      <h4>${recipe.label}</h4>
      <img src="${recipe.image}" alt="${recipe.label}">
      <a href="${recipe.url}" target="_blank">View Recipe</a>
      <button onclick="toggleShoppingList(${JSON.stringify(recipe).split('"').join("&quot;")})">Shopping List</button>
    `;
    recipesGrid.appendChild(recipeDiv);
  });
}
