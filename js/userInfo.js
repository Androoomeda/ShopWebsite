import { getUserInfo } from './api.js';

const orderCounter = document.getElementById('orderCounter');
const likeCounter = document.getElementById('likeCounter');

export let totalCartItems = 0;
export let totalLikes = 0;

export async function loadUserInfoCounters() {
  getUserInfo()
    .then(data => {
      totalLikes = data.favoritesCount;
      totalCartItems = data.cartItemsCount;
      likeCounter.textContent = totalLikes;
      orderCounter.textContent = totalCartItems;
    })
    .catch(error => {
      logger.consoleLog("Ошибка информации о пользователе " + error)
    })
}