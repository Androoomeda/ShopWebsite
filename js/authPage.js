import * as logger from './logger.js';

const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');

const toggleBtn = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const passwordError = document.getElementById('passwordError');

const authBtn = document.getElementById('authButton');

toggleBtn.addEventListener('click', () => {
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleBtn.src = 'sources/eye.svg';
  } else {
    passwordInput.type = 'password';
    toggleBtn.src = 'sources/eye-closed.svg';
  }
});

emailInput.addEventListener('input', updateRegisterButton);
passwordInput.addEventListener('input', updateRegisterButton);

authBtn.addEventListener('click', async (event) => {
  event.preventDefault();

  emailError.style.display = 'none';
  emailError.textContent = '';
  passwordError.style.display = 'none';
  passwordError.textContent = '';

  const data = {
    email: emailInput.value.trim(),
    password: passwordInput.value.trim()
  }

  try {
    const response = await fetch('http://localhost:5120/api/ShopUser/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include'
    });

    if (response.ok) {
      window.location.href = 'mainPage.html';
    }
    else {
      const error = await response.json();

      if (error.field === 'email') {
        emailError.textContent = error.message;
        emailError.style.display = 'block';
      }
      else if (error.field === 'password') {
        passwordError.textContent = error.message;
        passwordError.style.display = 'block';
      } else {
        logger.consoleLog('Ошибка входа: ' + (error.message || response.statusText));
        alert('Ошибка входа: ' + (error.message || response.statusText));
      }
    }
  } catch (error) {
    logger.consoleLog('Ошибка при отправке запроса: ' + (error.message || response.statusText));
  }
});

function updateRegisterButton() {
  const allValid =
    emailInput.value.trim() !== '' &&
    passwordInput.value.trim() !== '';

  authBtn.disabled = !allValid;
}
