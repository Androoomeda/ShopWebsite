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

    renderProducts(favoriteProducts);
  } catch (error) {
    logger.handleError(error, productList);
  }
}

function renderProducts(products) {
  productList.innerHTML = '';

  products.forEach(product => {
    const card = createCard(product, onLikeToggle, true);
    productList.appendChild(card);
  });
}

async function onLikeToggle(isLiked, productId) {
  try {
    if (isLiked) {
      await api.addToFavorite(productId)
    }
    else {
      await api.removeFavorite(productId)
    }

    loadUserInfoCounters();

  } catch (error) {
    logger.consoleLog("Ошибка продукта " + error)
  }
}