import { getUserInfo } from './api.js';
import * as logger from './logger.js';

const orderCounter = document.getElementById('orderCounter');
const likeCounter = document.getElementById('likeCounter');

export let totalCartItems = 0;
export let totalLikes = 0;

export async function loadUserInfoCounters() {
  const response = await getUserInfo();

  if (!response.unauthorized) {
    const data = response.data;

    totalLikes = data.favoritesCount;
    totalCartItems = data.cartItemsCount;
    likeCounter.textContent = totalLikes;
    orderCounter.textContent = totalCartItems;
  }
  else
    logger.consoleLog("Ошибка информации о пользователе " + response.error);
}