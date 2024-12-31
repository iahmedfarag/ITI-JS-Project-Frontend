document.addEventListener("DOMContentLoaded", function () {
    // Check if the user is already logged in
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
        window.location.href = "/";
        return;
    }
    // Cached DOM elements
    const loginForm = document.getElementById("loginForm");
    const emailInput = document.getElementById("emil");
    const passwordInput = document.getElementById("password");
    const emailError = document.getElementById("emailVal");
    const passwordError = document.getElementById("passwordVal");
    const rememberMeCheckbox = document.getElementById("rememberMe");

    // Load saved email and password
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");

    if (savedEmail && savedPassword) {
        emailInput.value = savedEmail;
        passwordInput.value = savedPassword;
        rememberMeCheckbox.checked = true;
    }

    // Validation Helper Functions
    const showError = (element, errorElement, message) => {
        errorElement.style.display = "block";
        errorElement.innerHTML = message;
        element.style.border = "2px solid red";
    };

    const hideError = (element, errorElement) => {
        errorElement.style.display = "none";
        element.style.border = "2px solid green";
    };

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) return "Please enter your email";
        if (!emailPattern.test(email)) return "Please enter a valid email address";
        return null;
    };

    const validatePassword = (password) => {
        if (!password) return "Please enter your password";
        return null;
    };

    // Email and Password Blur Events
    emailInput.addEventListener("blur", () => {
        const errorMessage = validateEmail(emailInput.value);
        if (errorMessage) {
            showError(emailInput, emailError, errorMessage);
        } else {
            hideError(emailInput, emailError);
        }
    });

    passwordInput.addEventListener("blur", () => {
        const errorMessage = validatePassword(passwordInput.value);
        if (errorMessage) {
            showError(passwordInput, passwordError, errorMessage);
        } else {
            hideError(passwordInput, passwordError);
        }
    });

    const errorMsgElement = document.getElementById("errorMsg");
    errorMsgElement.textContent = "";

    // Form Submit Event
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        // Validation
        const emailValidationError = validateEmail(emailInput.value);
        const passwordValidationError = validatePassword(passwordInput.value);

        if (emailValidationError) {
            showError(emailInput, emailError, emailValidationError);
        }

        if (passwordValidationError) {
            showError(passwordInput, passwordError, passwordValidationError);
        }

        if (emailValidationError || passwordValidationError) {
            alert("Please fix the errors before submitting.");
            return;
        }

        const loginData = {
            email: emailInput.value,
            password: passwordInput.value,
            rememberMe: rememberMeCheckbox.checked,
        };

        // Remember Me
        if (loginData.rememberMe) {
            localStorage.setItem("savedEmail", loginData.email);
            localStorage.setItem("savedPassword", loginData.password);
        } else {
            localStorage.removeItem("savedEmail");
            localStorage.removeItem("savedPassword");
        }

        // Submit Login Request
        try {
            const response = await fetch("https://iti-js-project-backend.vercel.app/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });
            const result = await response.json();
            if (response.ok) {
                const token = result.token;
                localStorage.setItem("authToken", token);
                if (result.user.role == "admin") {
                    window.location.href = "../dashboard/Dashboard.html";
                } else {
                    window.location.href = "/";
                }

                console.log("Login successful:", result.user);
            } else {
                errorMsgElement.style.display = "block";
                errorMsgElement.textContent = result.error;
                errorMsgElement.style.color = "red";
                console.error(`Login failed: ${error.message}`);
            }
        } catch (error) {
            console.error("An error occurred during login:", error.message);
        }
    });
});
