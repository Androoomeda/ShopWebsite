import * as api from './api.js'
import * as logger from './logger.js'

const likeCounter = document.getElementById('likeCounter');
const orderCounter = document.getElementById('orderCounter');

let totalLikes = 0;
let totalCartItems = 0;
let isLiked = false;
let selectedSizeId = null;
let selectedSize = null;

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const cartButton = document.getElementById('cartButton');
 updateAddToCartButtonState();

cartButton.addEventListener('click', () => {
  api.addToCart(productId, selectedSizeId)
    .then(() => {
      totalCartItems++;
      orderCounter.textContent = totalCartItems;
      cartButton.textContent = "В корзине";
      cartButton.disabled = true;
    })
    .catch(error => {
      logger.consoleLog(error);
    });
});

const likeButton = document.getElementById('likeButton');
likeButton.addEventListener('click', onLikeToggle);

try {
  const data = await api.getProductById(productId)
  initProductPage(data)
} catch (error) {
  logger.consoleLog(error);
}

function initProductPage(data) {
  const mainPhoto = document.getElementById('main-photo');
  mainPhoto.innerHTML =
    `<img src="http://localhost:5120${data.imagesPath[0]}" alt="${data.name}">`;

  const thumbnails = document.getElementById('thumbnails');
  thumbnails.innerHTML = '';

  data.imagesPath.forEach((imgSrc, index) => {
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

  document.getElementById('product-title').textContent = data.name;

  const priceElem = document.getElementById('product-price');
  
  if (data.discountPrice) {
    priceElem.innerHTML = `${data.price}$ <del class="product-discount">${data.discountPrice}$</del>`;
  }
  else {
    priceElem.textContent = `${data.price}$`;
  }

  const sizesContainer = document.getElementById('sizes');
  sizesContainer.innerHTML = '';

  data.sizes.forEach((size) => {
    const btn = document.createElement('button');
    btn.className = 'size-btn';
    btn.dataset.sizeId = size.id;
    btn.textContent = size.label;
    sizesContainer.appendChild(btn);
  });

  const paramsElem = document.getElementById('product-params');
  paramsElem.innerHTML = `
      <b>Type:</b> ${data.categoryName}<br>
      <b>Color:</b> ${data.color}<br>
      <b>Артикул:</b> ${data.id}`;

  document.getElementById('product-description').textContent = data.description;

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
  if (selectedSizeId !== null && selectedSize !== null) {
    cartButton.disabled = false;
  } else {
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