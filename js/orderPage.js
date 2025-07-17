import * as api from './api.js';
import * as logger from './logger.js';
import { loadUserInfoCounters } from './userInfo.js';


const cartItemsContainer = document.getElementById('cart-items');
const itemsAmount = document.getElementById('items-amount');
const totalOriginalPrice = document.getElementById('total-original-price');
const totalDiscount = document.getElementById('total-discount');
const totalPrice = document.getElementById('total-price');

loadProducts();

async function loadProducts() {
  const response = await api.getCartItems();
  loadUserInfoCounters();

  if (response.success)
    renderCartItems(response.data);
  else {
    logger.handleError(response.error, cartItemsContainer);
  }
}

function renderCartItems(data) {
  cartItemsContainer.innerHTML = '';
  updateTotals(data);

  if (!data.cartItems || data.cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p>Ваша корзина пуста.<p>';
    return;
  }

  data.cartItems.forEach(cartItem => {
    const card = createCartItem(cartItem);
    cartItemsContainer.appendChild(card);
  });
}

function createCartItem(cartItem) {
  let quantity = cartItem.quantity;
  let price = cartItem.product.price * cartItem.quantity;
  let originalPrice = cartItem.product.discountPrice * cartItem.quantity;

  const cartItemDiv = document.createElement('div');
  cartItemDiv.className = 'cart-item';

  const leftDiv = document.createElement('div');
  leftDiv.className = 'left';

  leftDiv.innerHTML =
    `<div class="cart-item-img">
    <a href="itemPage.html?id=${cartItem.product.id}">
      <img src="http://localhost:5120${cartItem.product.imagePath}" alt="${cartItem.product.name}">
    </a>
  </div>`;

  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'cart-item-actions';

  const qtyDiv = document.createElement('div');
  qtyDiv.className = 'cart-qty';

  const trashImg = document.createElement('img');
  trashImg.src = 'sources/trash.svg';
  trashImg.alt = 'Удалить';

  trashImg.addEventListener('click', () => {
    showDeleteConfirmation(async () => {
      removeCartItem(cartItem.product.id);
    });
  });

  const quantityValue = document.createElement('span');
  quantityValue.className = 'cart-qty-value';
  quantityValue.textContent = quantity;

  const btnMinus = document.createElement('button');
  btnMinus.className = 'cart-qty-btn';
  btnMinus.title = 'Уменьшить количество';
  btnMinus.textContent = '-';

  btnMinus.addEventListener('click', async () => {
    if (quantity > 1) {
      editCartItem(cartItem.id, quantity - 1);
    }
    else {
      showDeleteConfirmation(async () => {
        removeCartItem(cartItem.product.id);
      });
    }
  });

  const btnPlus = document.createElement('button');
  btnPlus.className = 'cart-qty-btn';
  btnPlus.title = 'Увеличить количество';
  btnPlus.textContent = '+';

  btnPlus.addEventListener('click', async () => {
    editCartItem(cartItem.id, quantity + 1);
  });

  qtyDiv.appendChild(trashImg);
  qtyDiv.appendChild(btnMinus);
  qtyDiv.appendChild(quantityValue);
  qtyDiv.appendChild(btnPlus);

  actionsDiv.appendChild(qtyDiv);
  leftDiv.appendChild(actionsDiv);

  const rightDiv = document.createElement('div');
  rightDiv.className = 'right';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'cart-item-title';
  titleDiv.textContent = cartItem.product.name;

  const colorDiv = document.createElement('div');
  colorDiv.className = 'cart-item-details';
  colorDiv.innerHTML = `<b>Color:</b> ${cartItem.product.color || 'не указан'}`;

  const sizeDiv = document.createElement('div');
  sizeDiv.className = 'cart-item-details';
  sizeDiv.innerHTML = `<b>Size:</b> ${cartItem.sizeLabel} (RU)`;

  const priceDiv = document.createElement('div');
  priceDiv.className = 'cart-item-price';

  if (originalPrice) {
    priceDiv.innerHTML = `${originalPrice}$ <span class="original-price">${price}$</span>`;
  }
  else {
    priceDiv.textContent = `${price}$`;
  }

  rightDiv.appendChild(titleDiv);
  rightDiv.appendChild(colorDiv);
  rightDiv.appendChild(sizeDiv);
  rightDiv.appendChild(priceDiv);

  cartItemDiv.appendChild(leftDiv);
  cartItemDiv.appendChild(rightDiv);

  return cartItemDiv;
}

function showDeleteConfirmation(onDelete) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  const popup = document.createElement('div');
  popup.className = 'popup';

  const message = document.createElement('p');
  message.textContent = 'Вы уверены, что хотите удалить товар из корзины?';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'popup-delete';
  deleteBtn.textContent = 'Удалить товар';

  const closeBtn = document.createElement('button');
  closeBtn.className = 'popup-close';
  closeBtn.textContent = 'Закрыть';

  popup.appendChild(message);
  popup.appendChild(deleteBtn);
  popup.appendChild(closeBtn);

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  deleteBtn.addEventListener('click', () => {
    onDelete();
    document.body.removeChild(overlay);
  });

  closeBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
}

async function editCartItem(cartItemId, quantity){
  const response = await api.editCartItem(cartItemId, quantity)

    if (response.success)
      loadProducts();
    else
      logger.handleError(response.error, cartItemsContainer);
}

async function removeCartItem(productId) {
  const response = await api.removeCartItem(productId);

  if (response.success)
    loadProducts();
  else
    logger.handleError(response.error, cartItemsContainer);
}

function updateTotals(data) {
  itemsAmount.textContent = data ? data.totalQuantity : 0;
  totalOriginalPrice.textContent = (data ? data.totalOriginalPrice : 0) + '$';
  totalDiscount.textContent = (data ? data.totalDiscount : 0) + '$';
  totalPrice.textContent = (data ? data.totalPrice : 0) + '$';
}