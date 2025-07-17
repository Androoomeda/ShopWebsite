import * as api from "./api.js";
import * as logger from './logger.js';

const logoutBtn = document.getElementById('logout');
const username = document.getElementById('username');
const email = document.getElementById('email');
const likeCounter = document.getElementById('likeCounter');
const orderCounter = document.getElementById('orderCounter');
logoutBtn.onclick = Logout;

loadUserInfo()

async function loadUserInfo() {
  const response = await api.getUserInfo();

  if (response.unauthorized) {
    window.location.href = 'auth.html';
  } else {
    logger.consoleLog(response.error);
  }

  if (response.success) {
    const data = response.data

    username.textContent = data.username;
    email.textContent = data.email;
    likeCounter.textContent = data.favoritesCount;
    orderCounter.textContent = data.cartItemsCount;
  }
}

async function Logout() {
  const response = await api.logoutUser();

  if (response.success) {
    window.location.href = 'auth.html';
  } else {
    logger.consoleLog(response.error);
  }
}