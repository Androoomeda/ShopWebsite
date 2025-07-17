import * as api from './api.js';
import * as logger from './logger.js';
import { createCard } from './card.js';
import { loadUserInfoCounters } from './userInfo.js';

const productList = document.getElementById('product-list');
const sidebar = document.getElementById('sidebar');

loadProducts();
loadUserInfoCounters();

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

async function onCategoryClick(categoryName) {
  const [products, favorites] = await Promise.all([api.getCategoryProducts(categoryName), safeGetFavoriteIds()]);

  if (products.success) {
    renderProducts(products.data, favorites.success ? favorites.data : []);
  }
  else {
    logger.handleError(products.error || favorites.error, productList);
  }
}

async function loadProducts() {
  const [products, favorites] = await Promise.all([api.getProducts(), safeGetFavoriteIds()]);

  if (products.success) {
    renderProducts(products.data, favorites.success ? favorites.data : []);
  }
  else {
    logger.handleError(products.error || favorites.error, productList);
  }
}

async function safeGetFavoriteIds() {
  const response = await api.getFavoriteIds();

  if (!response.success)
    logger.consoleLog(response.error);

  return response;
}

function renderProducts(products, favorites) {
  productList.innerHTML = '';
  const favoriteIds = new Set(favorites.map(fav => fav.productId));

  products.forEach(product => {
    const isLiked = favoriteIds.has(product.id);
    const card = createCard(product, isLiked);
    productList.appendChild(card);
  });
}