import * as api from './api.js';
import * as logger from './logger.js';
import { createCard } from './card.js';
import { loadUserInfoCounters } from './userInfo.js';

const productList = document.getElementById('product-list');
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
loadUserInfoCounters();

async function loadProducts() {
  const response = await api.getFavoriteProducts()

  if (response.success)
    renderProducts(response.data);
  else
    logger.handleError(response.error, productList);
}

async function onCategoryClick(categoryName) {
  const [products, favorites] = await Promise.all([api.getCategoryProducts(categoryName), api.getFavoriteProducts()]);

  if (products.success && favorites.success) {
    const favoriteIds = new Set(favorites.data.map(fav => fav.id));
    const favoriteProducts = products.data.filter(product => favoriteIds.has(product.id));

    renderProducts(favoriteProducts);
  }
  else
    logger.handleError(products.message || favorites.message, productList);
}

function renderProducts(products) {
  productList.innerHTML = '';

  products.forEach(product => {
    const card = createCard(product, true);
    productList.appendChild(card);
  });
}