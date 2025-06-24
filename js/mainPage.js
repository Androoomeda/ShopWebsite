import * as api from './api.js';
import * as logger from './logger.js'
import { createCard } from './card.js';

const orderCounter = document.getElementById('orderCounter');
const likeCounter = document.getElementById('likeCounter');

let totalCartItems = 0;
let totalLikes = 0;

const sidebar = document.getElementById('sidebar');

document.getElementById('openBtn').onclick = function () {
  sidebar.classList.add('open');
}

document.getElementById('closeBtn').onclick = function () {
  sidebar.classList.remove('open');
}

const productList = document.getElementById('product-list');

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
    const data = await api.fetchProducts()
    renderProducts(data);
  } catch (error) {
    logger.handleError(error, productList);
  }
}

async function onCategoryClick(categoryName) {
  try {
    const data = await api.fetchCategoryProducts(categoryName)
    renderProducts(data);
  } catch (error) {
    logger.handleError(error, productList);
  }
}

function renderProducts(products) {
  productList.innerHTML = '';
  products.forEach(product => {
    const card = createCard(product, onAddToCart, onLikeToggle);
    productList.appendChild(card);
  });
}


function onAddToCart() {
  totalCartItems++;
  orderCounter.textContent = totalCartItems;
}

function onLikeToggle(isLiked) {
  totalLikes = isLiked ? totalLikes + 1 : totalLikes - 1;
  likeCounter.textContent = totalLikes;
}