document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', () => {
    const inputId = button.getAttribute('data-target');
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
      input.type = 'text';
      button.src = 'sources/eye.svg';
    } else {
      input.type = 'password';
      button.src = 'sources/eye-closed.svg';
    }
  });
});

const usernameInput = document.getElementById('username');
const usernameError = document.getElementById('usernameError');

const emailInput = document.getElementById('email');
const emailError = document.getElementById('emailError');

const passwordInput = document.getElementById('password');
const repeatePasswordInput = document.getElementById('repeatPassword');

const uppercaseCheckbox = document.getElementById('uppercase');
const numberCheckbox = document.getElementById('number');
const specialCheckbox = document.getElementById('special');
const lengthCheckbox = document.getElementById('length');
const equalCheckbox = document.getElementById('equal');
const acceptCheckbox = document.getElementById('accept');

const registerBtn = document.getElementById('registerBtn');


let passwordValue;
let repeatValue;
let emailValue;

usernameInput.addEventListener('input', updateRegisterButton);

emailInput.addEventListener('input', () => {
  emailValue = emailInput.value.trim();

  if (emailValue === '')
    emailError.style.display = 'none';
  else if (!validateEmail(emailValue))
    emailError.style.display = 'block';
  else
    emailError.style.display = 'none';

  updateRegisterButton();
});

passwordInput.addEventListener('input', () => {
  passwordValue = passwordInput.value

  validatePassword(passwordValue);
  checkPasswords();
  updateRegisterButton();
});

repeatePasswordInput.addEventListener('input', () => {
  repeatValue = repeatePasswordInput.value;
  checkPasswords();
  updateRegisterButton();
});

acceptCheckbox.addEventListener("click", updateRegisterButton);

registerBtn.addEventListener('click', async (event) => {
  event.preventDefault();

  emailError.style.display = 'none';
  emailError.textContent = '';
  usernameError.style.display = 'none';
  usernameError.textContent = '';

  const data = {
    username: usernameInput.value.trim(),
    email: emailInput.value.trim(),
    password: passwordInput.value.trim()
  }

  try {
    const response = await fetch('http://localhost:5120/api/ShopUser/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      window.location.href = 'auth.html';
      alert('Регистрация прошла успешно!');
    }
    else {
      const error = await response.json();

      if (error.field === 'username') {
        usernameError.textContent = error.message;
        usernameError.style.display = 'block';
      }
      else if (error.field === 'email') {
        emailError.textContent = error.message;
        emailError.style.display = 'block';
      } else {
        alert('Ошибка регистрации: ' + (error.message || response.statusText));
      }
    }
  } catch (error) {
    alert('Ошибка при отправке запроса: ' + error.message);
  }
});

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  uppercaseCheckbox.checked = /[A-ZА-ЯЁ]/.test(password);
  numberCheckbox.checked = /\d/.test(password);
  specialCheckbox.checked = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  lengthCheckbox.checked = password.length > 6;
}

function checkPasswords() {
  if (passwordValue && repeatValue && (passwordValue === repeatValue)) {
    equalCheckbox.checked = true;
  } else {
    equalCheckbox.checked = false;
  }
}

function updateRegisterButton() {
  const allChecked =
    uppercaseCheckbox.checked &&
    numberCheckbox.checked &&
    specialCheckbox.checked &&
    lengthCheckbox.checked &&
    equalCheckbox.checked &&
    acceptCheckbox.checked;

  const allValid = validateEmail(emailValue) &&
    allChecked &&
    usernameInput.value.trim() !== '' &&
    emailInput.value.trim() !== '';

  registerBtn.disabled = !allValid;
}