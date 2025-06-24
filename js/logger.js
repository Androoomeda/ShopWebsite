export function consoleLog(message) {
  console.error(message);
}

export function showErrorMessageInContainer(message, container) {
  const errorMessage = document.createElement('p');
  errorMessage.textContent = message;
  errorMessage.style.color = 'black';
  errorMessage.style.fontSize = "30px";

  container.appendChild(errorMessage);
}

export function handleError(error, container) {
  const message = 'Ошибка: не удалось загрузить данные. Попробуйте позже. ' + error.message;
  showErrorMessageInContainer(message, container);
  consoleLog(message);
}

