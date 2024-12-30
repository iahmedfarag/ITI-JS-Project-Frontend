// Select all input fields and their corresponding error message elements
const inputs = [
    { id: 'firstName', errorId: 'firstName-e', errorMessage: 'Please enter your first name.' },
    { id: 'lastName', errorId: 'lastName-e', errorMessage: 'Please enter your last name.' },
    { id: 'email', errorId: 'email-e', errorMessage: 'Please enter a valid email address.' },
    { id: 'password', errorId: 'password-e', errorMessage: 'Please enter your password.' },
    { id: 'repeatPassword', errorId: 'repeatPassword-e', errorMessage: 'Please repeat your password.' }
];

// Function to validate an input field
function validateInput(inputId, errorId, errorMessage) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);

    inputElement.addEventListener('blur', function () {
        const value = this.value.trim();

        if (value === '') {
            errorElement.style.display = 'block';
            errorElement.textContent = errorMessage;
            inputElement.style.border = 'red 2px solid';
            inputElement.style.background = '#ffe6e6';
        } else {
            errorElement.style.display = 'none';
            inputElement.style.border = 'green 2px solid';
            inputElement.style.background = 'white';
        }
    });
}

// Add validation for each input field
inputs.forEach(({ id, errorId, errorMessage }) => {
    validateInput(id, errorId, errorMessage);
});

// Additional validation for matching passwords
const passwordElement = document.getElementById('password');
const repeatPasswordElement = document.getElementById('repeatPassword');
const repeatPasswordError = document.getElementById('repeatPassword-e');
const passwordError = document.getElementById('password-e');

passwordElement.addEventListener('blur', function () {
    const password = this.value.trim();

    if (password.length <= 5) {
        passwordError.style.display = 'block';
        passwordError.textContent = 'Password must be more than 5 characters.';
        passwordElement.style.border = 'red 2px solid';
        passwordElement.style.background = '#ffe6e6';
    } else {
        passwordError.style.display = 'none';
        passwordElement.style.border = 'green 2px solid';
        passwordElement.style.background = 'white';
    }
});

repeatPasswordElement.addEventListener('blur', function () {
    const password = passwordElement.value.trim();
    const repeatPassword = this.value.trim();

    if (password !== repeatPassword) {
        repeatPasswordError.style.display = 'block';
        repeatPasswordError.textContent = 'The passwords must match.';
        repeatPasswordElement.style.border = 'red 2px solid';
        repeatPasswordElement.style.background = '#ffe6e6';
    } else {
        repeatPasswordError.style.display = 'none';
        repeatPasswordElement.style.border = 'green 2px solid';
        repeatPasswordElement.style.background = 'white';
    }
});

// Additional validation for email format
const emailElement = document.getElementById('email');
const emailError = document.getElementById('email-e');
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

emailElement.addEventListener('blur', function () {
    const email = this.value.trim();

    if (!emailPattern.test(email)) {
        emailError.style.display = 'block';
        emailError.textContent = 'Please enter a valid email address.';
        emailElement.style.border = 'red 2px solid';
        emailElement.style.background = '#ffe6e6';
    } else {
        emailError.style.display = 'none';
        emailElement.style.border = 'green 2px solid';
        emailElement.style.background = 'white';
    }
});

// Handle form submission with async logic
const form = document.getElementById('registerForm');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    let hasError = false;

    inputs.forEach(({ id, errorId, errorMessage }) => {
        const inputElement = document.getElementById(id);
        const errorElement = document.getElementById(errorId);
        const value = inputElement.value.trim();

        if (value === '') {
            errorElement.style.display = 'block';
            errorElement.textContent = errorMessage;
            inputElement.style.border = 'red 2px solid';
            inputElement.style.background = '#ffe6e6';
            hasError = true;
        }
    });

    const password = passwordElement.value.trim();
    const repeatPassword = repeatPasswordElement.value.trim();

    if (password.length <= 5) {
        passwordError.style.display = 'block';
        passwordError.textContent = 'Password must be more than 5 characters.';
        passwordElement.style.border = 'red 2px solid';
        passwordElement.style.background = '#ffe6e6';
        hasError = true;
    }

    if (password !== repeatPassword) {
        repeatPasswordError.style.display = 'block';
        repeatPasswordError.textContent = 'The passwords must match.';
        repeatPasswordElement.style.border = 'red 2px solid';
        repeatPasswordElement.style.background = '#ffe6e6';
        hasError = true;
    }

    const email = emailElement.value.trim();
    if (!emailPattern.test(email)) {
        emailError.style.display = 'block';
        emailError.textContent = 'Please enter a valid email address.';
        emailElement.style.border = 'red 2px solid';
        emailElement.style.background = '#ffe6e6';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;

    const userData = { firstName, lastName, email, password, repeatPassword };

    try {
        const response = await fetch('https://iti-js-project-backend.vercel.app/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        if (response.ok) {
            alert('Registration successful!');
        } else {
            alert('Registration failed!');
        }
    } catch (error) {
        alert('An error occurred!');
    }
});
