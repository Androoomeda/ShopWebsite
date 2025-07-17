import * as logger from './logger.js';
import { loginUser } from './api.js';

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

  const response = await loginUser(data);
  emailError.textContent = '';
  passwordError.textContent = '';

  if (response.success) {
    window.location.href = 'mainPage.html';
  }
  else {
    const error = response.error;

    if (error.field === 'email') {
      emailError.textContent = error.message;
      emailError.style.display = 'block';
    }
    else if (error.field === 'password') {
      passwordError.textContent = error.message;
      passwordError.style.display = 'block';
    } else {
      logger.consoleLog('Ошибка входа: ' + error);
    }
  }
});

function updateRegisterButton() {
  const allValid =
    emailInput.value.trim() !== '' &&
    passwordInput.value.trim() !== '';

  authBtn.disabled = !allValid;
}
