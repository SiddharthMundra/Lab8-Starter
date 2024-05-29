// main.js

const RECIPE_URLS = [
  'https://adarsh249.github.io/Lab8-Starter/recipes/1_50-thanksgiving-side-dishes.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/2_roasting-turkey-breast-with-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/3_moms-cornbread-stuffing.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/4_50-indulgent-thanksgiving-side-dishes-for-any-holiday-gathering.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/5_healthy-thanksgiving-recipe-crockpot-turkey-breast.json',
  'https://adarsh249.github.io/Lab8-Starter/recipes/6_one-pot-thanksgiving-dinner.json',
];

window.addEventListener('DOMContentLoaded', init);

async function init() {
  initializeServiceWorker();
  let recipes;
  try {
      recipes = await getRecipes();
  } catch (err) {
      console.error(err);
  }
  addRecipesToDocument(recipes);
}

function initializeServiceWorker() {
  if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
          navigator.serviceWorker.register('./sw.js')
              .then(registration => {
                  console.log('ServiceWorker registration successful with scope: ', registration.scope);
              }, err => {
                  console.error('ServiceWorker registration failed: ', err);
              });
      });
  }
}

async function getRecipes() {
  let storedRecipes = localStorage.getItem('recipes');
  if (storedRecipes) {
      return JSON.parse(storedRecipes);
  } else {
      return new Promise(async (resolve, reject) => {
          let recipes = [];
          try {
              for (let url of RECIPE_URLS) {
                  const response = await fetch(url);
                  const recipe = await response.json();
                  recipes.push(recipe);
                  if (recipes.length === RECIPE_URLS.length) {
                      saveRecipesToStorage(recipes);
                      resolve(recipes);
                  }
              }
          } catch (err) {
              console.error(err);
              reject(err);
          }
      });
  }
}

function saveRecipesToStorage(recipes) {
  localStorage.setItem('recipes', JSON.stringify(recipes));
}

function addRecipesToDocument(recipes) {
  if (!recipes) return;
  let main = document.querySelector('main');
  recipes.forEach((recipe) => {
      let recipeCard = document.createElement('recipe-card');
      recipeCard.data = recipe;
      main.append(recipeCard);
  });
}
