console.log("asds");
// asdsd@gmail.com

document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    // Check for validation errors
    const emailError = document.getElementById("emailVal").style.display !== "none";
    const passwordError = document.getElementById("passwordVal").style.display !== "none";

    if (emailError || passwordError) {
        alert("Please fix the errors before submitting.");
        return;
    }

    const email = document.getElementById('emil').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Save or remove email/password based on checkbox state
    if (rememberMe) {
        localStorage.setItem('savedEmail', email);
        localStorage.setItem('savedPassword', password);
    } else {
        localStorage.removeItem('savedEmail');
        localStorage.removeItem('savedPassword');
    }

    const loginData = { email, password, rememberMe };

    try {
        const response = await fetch('https://iti-js-project-backend.vercel.app/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
        });

        if (response.ok) {
            const result = await response.json();
            const token = result.token;
            localStorage.setItem('authToken', token);
            window.location.href = '/';
            console.log(result); 
        } else {
            const error = await response.json();
            console.log(`Login failed: ${error.message}`);
        }
    } catch (error) {
        console.log("An error occurred during login.");
    }
});

document.getElementById('emil').addEventListener('blur', function () {
    const email = this.value;
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email === "") {
        document.getElementById("emailVal").style.display = "block";
        document.getElementById("emailVal").innerHTML = "Please enter your email";
        document.getElementById("emil").style.border = "red 2px solid";
    } else if (!emailPattern.test(email)) {
        document.getElementById("emailVal").style.display = "block";
        document.getElementById("emailVal").innerHTML = "Please enter a valid email address.";
        document.getElementById("emil").style.border = "red 2px solid";
    } else {
        document.getElementById("emailVal").style.display = "none";
        document.getElementById("emil").style.border = "green 2px solid";
    }
});

document.getElementById('password').addEventListener('blur', function () {
    const password = this.value;

    if (password === "") {
        document.getElementById("passwordVal").style.display = "block";
        document.getElementById("passwordVal").innerHTML = "Please enter your password";
        document.getElementById("password").style.border = "red 2px solid";
    } else {
        document.getElementById("passwordVal").style.display = "none";
        document.getElementById("password").style.border = "green 2px solid";
    }
});

// Load saved email and password when the page loads
document.addEventListener('DOMContentLoaded', function () {
    const savedEmail = localStorage.getItem('savedEmail');
    const savedPassword = localStorage.getItem('savedPassword');

    if (savedEmail && savedPassword) {
        document.getElementById('emil').value = savedEmail;
        document.getElementById('password').value = savedPassword;
        document.getElementById('rememberMe').checked = true;
    }
});

