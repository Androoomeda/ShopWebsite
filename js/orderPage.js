import * as api from './api.js';
import * as logger from './logger.js';

const orderCounter = document.getElementById('orderCounter');
const likeCounter = document.getElementById('likeCounter');
const cartItemsContainer = document.getElementById('cart-items');

const totalOriginalPrice = document.getElementById('total-original-price');
const totalDiscount = document.getElementById('total-discount');
const totalPrice = document.getElementById('total-price');
const itemsAmount = document.getElementById('items-amount');

let totalCartItems = 0;
let totalLikes = 0;

loadProducts();

async function loadProducts() {
  try {
    const data = await api.getCartItems();
    renderCartItems(data);
  } catch (error) {
    logger.handleError(error, cartItemsContainer);
  }
}

function renderCartItems(data) {
  cartItemsContainer.innerHTML = '';

  if (!data.cartItems || data.cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p>Ваша корзина пуста.<p>';
    return;
  }

  totalCartItems = data.cartItems.length;
  updateItemsAmount();
  updateTotals(data);

  data.cartItems.forEach(cartItem => {
    const card = createCartItem(cartItem);
    cartItemsContainer.appendChild(card);
  });
}

function createCartItem(cartItem) {
  let quantity = cartItem.quantity;
  let price = cartItem.product.price;
  let discountPrice = cartItem.product.discountPrice;

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
    showDeleteConfirmation(() => {
      api.removeCartItem(cartItem.product.id)
        .then(() => {
          cartItemDiv.remove();
          totalCartItems--;
          orderCounter.textContent = totalCartItems;
          itemsAmount.textContent = totalCartItems;
        })
        .catch(error => {
          logger.handleError(error, cartItemsContainer);
        });
    });
  });

  const quantityValue = document.createElement('span');
  quantityValue.className = 'cart-qty-value';
  quantityValue.textContent = quantity;

  const btnMinus = document.createElement('button');
  btnMinus.className = 'cart-qty-btn';
  btnMinus.title = 'Уменьшить количество';
  btnMinus.textContent = '-';

  btnMinus.addEventListener('click', () => {
    if (quantity > 1) {
      quantity--;
      totalCartItems--;

      updateItemsAmount();

      quantityValue.textContent = quantity;
      price = quantity * cartItem.product.price;
      discountPrice = quantity * cartItem.product.discountPrice;

      if (product.discountPrice) {
        priceDiv.innerHTML = `${product.discountPrice}$ <del class="product-discount">${product.price}$</del>`;
      }
      else {
        priceDiv.textContent = `${product.price}$`;
      }
    }
    else {
      showDeleteConfirmation(() => {
        api.removeCartItem(cartItem.product.id)
          .then(() => {
            cartItemDiv.remove();
            totalCartItems--;

            updateItemsAmount();
          })
          .catch(error => {
            logger.handleError(error, cartItemsContainer);
          });
      });
    }
  });

  const btnPlus = document.createElement('button');
  btnPlus.className = 'cart-qty-btn';
  btnPlus.title = 'Увеличить количество';
  btnPlus.textContent = '+';

  btnPlus.addEventListener('click', () => {
    quantity++;
    totalCartItems++;

    quantityValue.textContent = quantity;
    price = quantity * cartItem.product.price;
    discountPrice = quantity * cartItem.product.discountPrice;
    updateItemsAmount();

    priceDiv.innerHTML = `${price}$ <del class="product-discount">${discountPrice || ''}$</del>`;
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

  if (discountPrice) {
    priceDiv.innerHTML = `${discountPrice}$ <del class="product-discount">${price}$</del>`;
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

function updateItemsAmount() {
  orderCounter.textContent = totalCartItems;
  itemsAmount.textContent = totalCartItems;
}

function updateTotals(data) {
  totalOriginalPrice.textContent = data.totalOriginalPrice + '$';
  totalDiscount.textContent = data.totalDiscount + '$';
  totalPrice.textContent = data.totalPrice + '$';
}