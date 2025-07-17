import * as api from './api.js'
import * as logger from './logger.js'
import { loadUserInfoCounters } from './userInfo.js';

const likeButton = document.getElementById('likeButton');
const cartButton = document.getElementById('cartButton');

let isLiked;
let isInCart;
let selectedSizeId = null;
let selectedSize = null;

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

loadItem();
loadUserInfoCounters();

async function loadItem() {
  const response = await api.getProductById(productId)

  if (response.success)
    initProductPage(response.data)
  else
    logger.consoleLog(error);
}

async function initProductPage(product) {
  const mainPhoto = document.getElementById('main-photo');
  mainPhoto.innerHTML =
    `<img src="http://localhost:5120${product.imagesPath[0]}" alt="${product.name}">`;

  const thumbnails = document.getElementById('thumbnails');
  thumbnails.innerHTML = '';

  product.imagesPath.forEach((imgSrc, index) => {
    const img = document.createElement('img');
    img.src = `http://localhost:5120${imgSrc}`;
    img.alt = `thumb${index + 1}`;

    if (index === 0) img.classList.add('active');

    img.addEventListener('click', () => {
      thumbnails.querySelectorAll('img').forEach(i => i.classList.remove('active'));
      img.classList.add('active');
      mainPhoto.querySelector('img').src = imgSrc;
    });

    thumbnails.appendChild(img);
  });

  document.getElementById('product-title').textContent = product.name;

  const priceElem = document.getElementById('product-price');
  if (product.discountPrice) {
    priceElem.innerHTML = `${product.discountPrice}$ <span class="original-price">${product.price}$</span>`;
  }
  else {
    priceElem.textContent = `${product.price}$`;
  }

  const sizesContainer = document.getElementById('sizes');
  sizesContainer.innerHTML = '';

  product.sizes.forEach((size) => {
    const btn = document.createElement('button');
    btn.className = 'size-btn';
    btn.dataset.sizeId = size.id;
    btn.textContent = size.label;
    sizesContainer.appendChild(btn);
  });

  isInCart = product.isInCart;
  updateCartButtonState();
  checkAddedState();

  cartButton.addEventListener('click', () => {
   onAddToCart();
  });

  isLiked = product.isFavorite;
  likeButton.src = isLiked ? 'sources/addedfavorite.svg' : 'sources/favorite.svg';
  likeButton.addEventListener('click', onLikeToggle);

  const paramsElem = document.getElementById('product-params');
  paramsElem.innerHTML = `
      <b>Type:</b> ${product.categoryName}<br>
      <b>Color:</b> ${product.color}<br>
      <b>Артикул:</b> ${product.id}`;

  document.getElementById('product-description').textContent = product.description;

  const thumbnailsImages = document.querySelectorAll('#thumbnails img');
  const mainImage = document.querySelector('#main-photo img');
  thumbnailsImages.forEach(thumb => {
    thumb.addEventListener('click', function () {
      thumbnailsImages.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      mainImage.src = this.src;
    });
  });

  const sizeBtns = document.querySelectorAll('.size-btn');
  sizeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      sizeBtns.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
      selectedSizeId = this.dataset.sizeId;
      selectedSize = this.textContent;

      updateCartButtonState();
    });
  });
}

function updateCartButtonState() {
  if (isInCart) return;

  if (selectedSizeId !== null && selectedSize !== null) {
    cartButton.disabled = false;
  } else {
    cartButton.disabled = true;
  }
}

function checkAddedState() {
  if (isInCart) {
    cartButton.textContent = "В корзине";
    cartButton.style.backgroundColor = 'green';
    cartButton.disabled = true;
  }
}

async function onAddToCart(){
   const response = await api.addToCart(productId, selectedSizeId);

    if (response.success) {
      isInCart = true;
      checkAddedState();
      loadUserInfoCounters();
    }
    else
      logger.consoleLog(response.error);
}

async function onLikeToggle() {
  isLiked = !isLiked;
  let response;
  
  if (isLiked) {
    response = await api.addToFavorite(productId);
  }
  else {
    response = await api.removeFavorite(productId);
  }

  if (response.success) {
    likeButton.src = isLiked ? 'sources/addedfavorite.svg' : 'sources/favorite.svg';
    loadUserInfoCounters();
  }
  else
    logger.consoleLog("Ошибка продукта " + response.error);
}