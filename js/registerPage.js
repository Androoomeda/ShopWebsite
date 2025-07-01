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

const loginInput = document.getElementById('login');
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

loginInput.addEventListener('input', updateSubmitButton);

emailInput.addEventListener('input', () => {
  emailValue = emailInput.value.trim();

  if (emailValue === '') 
    emailError.style.display = 'none'; 
  else if (!validateEmail(emailValue)) 
    emailError.style.display = 'block'; 
  else 
    emailError.style.display = 'none';
  
  updateSubmitButton();
});

passwordInput.addEventListener('input', () => {
  passwordValue = passwordInput.value

  validatePassword(passwordValue);
  checkPasswords();
  updateSubmitButton();
});

repeatePasswordInput.addEventListener('input', () => {
  repeatValue = repeatePasswordInput.value;
  checkPasswords();
  updateSubmitButton();
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

function updateSubmitButton() {
  const allChecked =
    uppercaseCheckbox.checked &&
    numberCheckbox.checked &&
    specialCheckbox.checked &&
    lengthCheckbox.checked &&
    equalCheckbox.checked &&
    acceptCheckbox.checked;

  const allValid = validateEmail(emailValue) &&
    allChecked &&
    loginInput.value.trim() !== '' &&
    emailInput.value.trim() !== '';

  registerBtn.disabled = !allValid;
}