document.querySelectorAll('.toggle-password').forEach(button => {
  button.addEventListener('click', () => {
    const inputId = button.getAttribute('data-target');
    const input = document.getElementById(inputId);
    if (!input) return;

    if (input.type === 'password') {
      input.type = 'text';
      button.textContent = '🙈';
    } else {
      input.type = 'password';
      button.textContent = '👁️';
    }
  });
});

const passwordInput = document.getElementById('password');
const repeatePasswordInput = document.getElementById('repeatPassword');
const uppercaseCheckbox = document.getElementById('uppercase');
const numberCheckbox = document.getElementById('number');
const specialCheckbox = document.getElementById('special');
const lengthCheckbox = document.getElementById('length');
const passwordsCheckbox = document.getElementById('passwordsEqual');
const submitBtn = document.getElementById('submitBtn');

const passwordValue = passwordInput.value;
const repeatValue = repeatePasswordInput.value;

passwordInput.addEventListener('input', () => {
  const hasUppercase = /[A-ZА-ЯЁ]/.test(passwordValue);
  uppercaseCheckbox.checked = hasUppercase;

  const hasNumber = /\d/.test(passwordValue);
  numberCheckbox.checked = hasNumber;

  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(passwordValue);
  specialCheckbox.checked = hasSpecial;

  const hasLength = passwordValue.length > 6;
  lengthCheckbox.checked = hasLength;

  checkPasswords();
  updateSubmitButton();
});

repeatePasswordInput.addEventListener('input', checkPasswords);

function checkPasswords(){
  if(passwordValue === repeatValue && (passwordValue && repeatValue)){
    passwordsCheckbox.checked = true;
  }
  else{
    passwordsCheckbox.checked = false;
  }
}

function updateSubmitButton() {
  const allValid = uppercaseCheckbox.checked &&
                   numberCheckbox.checked &&
                   specialCheckbox.checked &&
                   lengthCheckbox.checked &&
                   passwordsCheckbox.checked;

  submitBtn.disabled = !allValid;
}