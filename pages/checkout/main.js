
// ^01[0-2,5]{1}[0-9]{8}$
// // /^[\+]?[0-9]{0,3}\W?+[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
//  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const inputs = [
    { 
        id: 'checkout-email', 
        errorId: 'email-e', 
        errorMessage: 'Please enter a valid email address.', 
        regex: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ 
    },
    { 
        id: 'checkout-phone', 
        errorId: 'phone-e', 
        errorMessage: 'Please enter a valid phone number.', 
        regex: /^01[0-2,5]{1}[0-9]{8}$/ 
    },
    { 
        id: 'checkout-name', 
        errorId: 'name-e', 
        errorMessage: 'Full Name cannot be empty.', 
        regex: /.+/ // Any non-empty value
    },
    { 
        id: 'checkout-address', 
        errorId: 'address-e', 
        errorMessage: 'Address must contain at least three words.', 
        regex: /^(\w+\s+){2,}\w+$/ // At least three words
    }
];

// Function to validate an input field using regex
function validateInput(inputId, errorId, errorMessage, regex) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.getElementById(errorId);

    inputElement.addEventListener('blur', function () {
        const value = this.value.trim();

        if (value === '' || !regex.test(value)) {
            errorElement.style.display = 'block';
            errorElement.textContent = value === '' ? 'This field cannot be empty.' : errorMessage;
            inputElement.style.border = '2px solid red';
            inputElement.style.background = '#ffe6e6';
        } else {
            errorElement.style.display = 'none';
            inputElement.style.border = '2px solid green';
            inputElement.style.background = 'white';
        }
    });

    inputElement.addEventListener('input', function () {
        if (regex.test(this.value.trim())) {
            errorElement.style.display = 'none';
            inputElement.style.border = '2px solid green';
            inputElement.style.background = 'white';
        }
    });
}

// Add validation for each input field
inputs.forEach(({ id, errorId, errorMessage, regex }) => {
    validateInput(id, errorId, errorMessage, regex);
});

// Handle form submission
const form = document.getElementById('checkout-form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    
    let isValid = true;

    // Validate all inputs on submit
    inputs.forEach(({ id, errorId, errorMessage, regex }) => {
        const inputElement = document.getElementById(id);
        const errorElement = document.getElementById(errorId);

        if (inputElement.value.trim() === '' || !regex.test(inputElement.value.trim())) {
            errorElement.style.display = 'block';
            errorElement.textContent = inputElement.value.trim() === '' ? 'This field cannot be empty.' : errorMessage;
            inputElement.style.border = '2px solid red';
            inputElement.style.background = '#ffe6e6';
            isValid = false;
        }
    });

    // Check if any error messages are visible
    const errorMessages = document.querySelectorAll('.error-message');
    const anyErrorVisible = Array.from(errorMessages).some(error => error.style.display === 'block');

    if (anyErrorVisible || !isValid) {
        // alert('Please fix the errors in the form before submitting.');
        return; // Exit early if validation fails or errors are visible
    }

    // If all validations are passed, proceed with form submission
    submitForm(event);
});

// Submit Form Function
const url = 'https://iti-js-project-backend.vercel.app/api/order/checkout';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZlZjhkNjVkNzU0NTRhNWY0MGUyNTQiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNTMzNjc3NSwiZXhwIjoxNzM1OTQxNTc1fQ.ts6sV0HH4pCEBRfilS_3RDBOEhouVcQUOO0NYZjFGgU";

async function submitForm(event) {
    event.preventDefault(); // Prevent form submission
    const form = event.target;

    const data = {
        name: form["checkout-name"].value,
        email: form["checkout-email"].value,
        address: form["checkout-address"].value,
        phone: form["checkout-phone"].value,
    };

    console.log(data.address); // Debugging purpose

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        console.log(response); 
        // Handle response
        if (response.ok) {
            const result = await response.json();
            alert('Order submitted successfully!');
            console.log(result);
        } else {
            const error = await response.json();
            alert(`Error: ${error.message || 'An unknown error occurred'}`);
        }
    } catch (error) {
        console.error('An error occurred:', error);
        alert('Failed to submit order. Please try again.');
    }
}
