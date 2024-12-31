document.getElementById("login-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("passWord").value;

    const loginData = {
        email: email,
        password: password,
    };

    const errorMsgElement = document.getElementById("errorMsg");
    errorMsgElement.textContent = "";

    try {
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem("token", data.token);
            window.location.href = "Dashboard.html";
        } else {
            errorMsgElement.style.display = "block";
            errorMsgElement.textContent = data.error;
            errorMsgElement.style.color = "red";
        }
    } catch (error) {
        console.error("Error:", error);
        errorMsgElement.textContent = "An error occurred while logging in.";
    }
});
