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
    const [products, favorites] = await Promise.all([api.getProducts(), safeGetFavoriteIds()]);
    renderProducts(products, favorites);
  } catch (error) {
    logger.handleError(error, productList);
  }
}

async function onCategoryClick(categoryName) {
  try {
    const [products, favorites] = 
      await Promise.all([api.getCategoryProducts(categoryName), safeGetFavoriteIds()]);
      
    renderProducts(products, favorites);
  } catch (error) {
    logger.handleError(error, productList);
  }
}

async function safeGetFavoriteIds() {
  try {
    return await api.getFavoriteIds();
  } catch (error) {
    return [];
  }
}

function renderProducts(products, favorites) {
  productList.innerHTML = '';
  const favoriteIds = new Set(favorites.map(fav => fav.productId));
  totalLikes = favoriteIds.size;
  likeCounter.textContent = totalLikes;

  products.forEach(product => {
    const isLiked = favoriteIds.has(product.id);
    const card = createCard(product, onLikeToggle, isLiked);
    productList.appendChild(card);
  });
}

async function onLikeToggle(isLiked, productId) {
  try {
    if (isLiked) {
      await api.addToFavorite(productId);
      totalLikes++;
    }
    else {
      await api.removeFavorite(productId);
      totalLikes--;
    }

    likeCounter.textContent = totalLikes;
  } catch (error) {
    logger.consoleLog("Ошибка продукта " + error)
  }
}