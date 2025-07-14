import * as api from './api.js'
import * as logger from './logger.js'

const likeCounter = document.getElementById('likeCounter');
const orderCounter = document.getElementById('orderCounter');
const likeButton = document.getElementById('likeButton');
const cartButton = document.getElementById('cartButton');

let totalLikes = 0;
let totalCartItems = 0;
let isLiked;
let isInCart;
let selectedSizeId = null;
let selectedSize = null;

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

try {
  const data = await api.getProductById(productId)
  initProductPage(data)
} catch (error) {
  logger.consoleLog(error);
}

function initProductPage(product) {
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
  updateAddToCartButtonState();
  checkAddedState();

  cartButton.addEventListener('click', () => {
    api.addToCart(productId, selectedSizeId)
      .then(() => {
        totalCartItems++;
        orderCounter.textContent = totalCartItems;
        checkAddedState();
      })
      .catch(error => {
        logger.consoleLog(error);
      });
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
      updateAddToCartButtonState();
    });
  });
}

function updateAddToCartButtonState() {
  if(isInCart) return;

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

async function onLikeToggle() {
  isLiked = !isLiked;
  likeButton.src = isLiked ? 'sources/addedfavorite.svg' : 'sources/favorite.svg';
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
    logger.consoleLog("Ошибка продукта " + error);
  }
}