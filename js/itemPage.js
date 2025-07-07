import * as api from './api.js'
import * as logger from './api.js'

const likeCounter = document.getElementById('likeCounter');
const orderCounter = document.getElementById('orderCounter');

let totalLikes = 0;
let totalCartItems = 0;
let isLiked = false;

const sidebar = document.getElementById('sidebar');

document.getElementById('openBtn').onclick = function () {
  sidebar.classList.add('open');
}

document.getElementById('closeBtn').onclick = function () {
  sidebar.classList.remove('open');
}

const cartButton = document.getElementById('cartButton');
cartButton.addEventListener('click', () => {
  totalCartItems++;
  orderCounter.textContent = totalCartItems;
  cartButton.textContent = "В корзине";
  cartButton.disabled = true;
});

const likeButton = document.getElementById('likeButton');
likeButton.addEventListener('click', () => {
  isLiked = !isLiked;
  likeButton.src = isLiked ? 'sources/addedfavorite.svg' : 'sources/favorite.svg';
  totalLikes = isLiked ? totalLikes + 1 : totalLikes - 1;

  likeCounter.textContent = totalLikes;
});

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

try {
  const data = await api.getProductById(productId)
  initProductPage(data)
} catch (error) {
  logger.consoleLog(error);
}


function initProductPage(data) {
  const mainPhoto = document.getElementById('main-photo');
  mainPhoto.innerHTML = `<img src="http://localhost:5120${data.imagesPath[0]}" alt="${data.name}">`;

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

  data.sizesLabel.forEach((size, index) => {
    const btn = document.createElement('button');
    btn.className = 'size-btn';
    if (index === 0) btn.classList.add('selected');
    btn.textContent = size;
    sizesContainer.appendChild(btn);
  });

  const paramsElem = document.getElementById('product-params');
  paramsElem.innerHTML = `
      <b>Type:</b> ${data.categoryName}<br>
      <b>Color:</b> ${data.color}<br>
      <b>Артикул:</b> ${data.id}`;

  document.getElementById('product-description').textContent = data.description;

  const thumbnailsImages = document.querySelectorAll('.thumbnails img');
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
    });
  });
}