import * as api from './api.js';
import * as logger from './logger.js';
import { createCard } from './card.js';

const orderCounter = document.getElementById('orderCounter');
const likeCounter = document.getElementById('likeCounter');
const productList = document.getElementById('product-list');

let totalCartItems = 0;
let totalLikes = 0;

const sidebar = document.getElementById('sidebar');

document.getElementById('openBtn').onclick = function () {
  sidebar.classList.add('open');
}

document.getElementById('closeBtn').onclick = function () {
  sidebar.classList.remove('open');
}

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[data-category]');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const category = link.dataset.category;
      onCategoryClick(category);
    });
  });
});

loadProducts();

async function loadProducts() {
  try {
    const data = await api.getFavoriteProducts()
    renderProducts(data);
  } catch (error) {
    logger.handleError(error, productList);
  }
}

async function onCategoryClick(categoryName) {
  try {
    const [products, favorites] = await Promise.all([api.getCategoryProducts(categoryName), api.getFavoriteProducts()]);
    const favoriteIds = new Set(favorites.map(fav => fav.id));
    const favoriteProducts = products.filter(product => favoriteIds.has(product.id));

    totalLikes = favoriteIds.size;
    likeCounter.textContent = totalLikes;

    renderProducts(favoriteProducts);
  } catch (error) {
    logger.handleError(error, productList);
  }
}

function renderProducts(products) {
  productList.innerHTML = '';

  totalLikes = products.length;
  likeCounter.textContent = totalLikes;

  products.forEach(product => {
    const card = createCard(product, onAddToCart, onLikeToggle, true);
    productList.appendChild(card);
  });
}

function onAddToCart() {
  totalCartItems++;
  orderCounter.textContent = totalCartItems;
}

async function onLikeToggle(isLiked, productId) {
  try
  {
    if(isLiked){
      await api.addToFavorite(productId)
      totalLikes = totalLikes + 1;
    }
    else {
      await api.RemoveFavorite(productId)
      totalLikes = totalLikes - 1;
    }

    likeCounter.textContent = totalLikes;
  } catch (error) {
    logger.consoleLog("Ошибка продукта " + error)
  }
}