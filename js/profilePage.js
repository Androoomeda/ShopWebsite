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
  try {
    const data = await api.getUserInfo();

    username.textContent = data.username;
    email.textContent = data.email;
    likeCounter.textContent = data.favoritesCount;
    orderCounter.textContent = data.cartItemsCount;

  } catch (error) {
    if (error.status === 401) {
      window.location.href = 'auth.html';
    } else {
      logger.consoleLog(error);
    }
  }
}

async function Logout() {
  try {
    const response = await api.logoutUser();

    if (response.ok) {
      window.location.href = 'auth.html';
    }
  } catch (error) {
    logger.consoleLog(error);
  }
}