let currentUsers = [];
const alertUser = (msg, du = 3000) => {
    const alertEl = document.getElementById("alertEl");
    alertEl.innerHTML = msg;
    alertEl.classList.add("active");

    setTimeout(() => {
        alertEl.classList.remove("active");
    }, du);
};
document.querySelector(".search").addEventListener("input", function () {
    const searchQuery = this.value.toLowerCase();
    const filteredUsers = currentUsers.filter((user) => {
        return user.firstName.toLowerCase().includes(searchQuery) || user.lastName.toLowerCase().includes(searchQuery) || user.email.toLowerCase().includes(searchQuery) || user.role.toLowerCase().includes(searchQuery);
    });
    displayUsers(filteredUsers);
});

document.addEventListener("DOMContentLoaded", function () {
    alertUser("hi");

    const token = localStorage.getItem("token");
    if (!token) {
        alert("User not authenticated!");
        return;
    }

    async function fetchUsers() {
        try {
            const response = await fetch("https://iti-js-project-backend.vercel.app/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error("Failed to fetch users");

            const users = await response.json();
            currentUsers = users;
            displayUsers(currentUsers);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    fetchUsers();
});

const displayUsers = (users) => {
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";
    if (!tableBody) {
        console.error("Table body not found!");
        return;
    }

    const userCount = users.length;
    const userCountElement = document.querySelector(".header span");
    if (userCountElement) {
        userCountElement.innerText = userCount;
    }

    users.forEach((user) => {
        const userRow = document.createElement("tr");
        userRow.innerHTML = `
            <td>
                <div class="flex items-center">
                    <input type="checkbox" class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500">
                </div>
            </td>
            <td>${user._id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
            <td class="custom-tdd">
                <div class="flex">
                    <button type="button" class="delete-button" onclick="deleteuser('${user._id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clip-rule="evenodd" />
                        </svg>
                        Delete
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(userRow);
    });
};

function deleteuser(userId) {
    const confirmation = confirm("Are you sure you want to delete this User?");
    if (!confirmation) return;

    const token = localStorage.getItem("token");
    if (!token) {
        alert("User not authenticated!");
        return;
    }

    fetch(`https://iti-js-project-backend.vercel.app/api/users/${userId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
        .then((response) => {
            if (!response.ok) throw new Error("Failed to delete user");
            alertUser("User deleted successfully!");

            currentUsers = currentUsers.filter((us) => us._id !== userId);
            displayUsers(currentUsers);
        })
        .catch((error) => {
            console.error("Error deleting user:", error);
            alert("Error deleting user. Please try again.");
        });
}

var modalUser = document.getElementById("Dom-modal-AddUser");

function addModaluser() {
    modalUser.style.visibility = "visible";
    modalUser.style.display = "flex";
}
function closeModalAddUser() {
    modalUser.style.visibility = "hidden";
    modalUser.style.display = "none";
}

document.getElementById("addUserForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
        alert("User not authenticated!");
        return;
    }

    const email = document.getElementById("Useremil").value;
    const firstName = document.getElementById("firstNameUser").value;
    const lastName = document.getElementById("lastNameUser").value;
    const password = document.getElementById("password").value;
    const repeatPassword = document.getElementById("re-password").value;
    const role = document.getElementById("role").value;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    const nameRegex = /^[a-zA-Z\s]{2,}$/;
    if (!nameRegex.test(firstName)) {
        alert("First name is invalid. It should only contain letters and spaces.");
        return;
    }
    if (!nameRegex.test(lastName)) {
        alert("Last name is invalid. It should only contain letters and spaces.");
        return;
    }

    if (password !== repeatPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        repeatPassword: repeatPassword,
        role: role,
    };

    fetch("https://iti-js-project-backend.vercel.app/api/users", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    })
        .then((response) => response.json())
        .then((data) => {
            alertUser("User added successfully!");
            document.getElementById("addUserForm").reset();
            closeModalAddUser();
            let userDataEdited = { ...data.user, _id: data.user.id };
            currentUsers.push(userDataEdited);
            displayUsers(currentUsers);
        })
        .catch((error) => {
            console.error("Error adding user:", error);
            alert("Error adding user. Please try again.", error);
        });
});
