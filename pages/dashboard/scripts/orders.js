//Orders

let modalOrder = document.getElementById("Dom-modal-orderDetails");
const alertUser = (msg, du = 3000) => {
    const alertEl = document.getElementById("alertEl");
    alertEl.innerHTML = msg;
    alertEl.classList.add("active");

    setTimeout(() => {
        alertEl.classList.remove("active");
    }, du);
};
function ViewModalOrder() {
    modalOrder.style.visibility = "visible";
    modalOrder.style.display = "flex";
}
function closeModalOrder() {
    modalOrder.style.visibility = "hidden";
    modalOrder.style.display = "none";
}

let allOrders = [];

document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.querySelector(".search");

    fetch("https://iti-js-project-backend.vercel.app/api/order", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                allOrders = data.orders;
                renderOrders(allOrders);
            } else {
                console.error("Failed to fetch orders");
            }
        })
        .catch((error) => console.error("Error:", error));

    renderOrders(orders);

    searchInput.addEventListener("input", function () {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredOrders = allOrders.filter((order) => order.name.toLowerCase().includes(searchTerm) || order.status.toLowerCase().includes(searchTerm) || order.paymentMethod.toLowerCase().includes(searchTerm));
        renderOrders(filteredOrders);
    });
});

function renderOrders(orders) {
    const ordersTableBody = document.querySelector(".tbody");
    ordersTableBody.innerHTML = "";

    orders.forEach((order) => {
        const row = document.createElement("tr");

        let statusClass = "";
        let statusText = "";

        switch (order.status) {
            case "pending":
                statusClass = "bg-red-pending";
                statusText = "Pending";
                break;
            case "approved":
                statusClass = "bg-green-accepted";
                statusText = "Approved";
                break;
            case "declined":
                statusClass = "bg-red-Canseled";
                statusText = "Declined";
                break;
            default:
                statusClass = "bg-gray-unknown";
                statusText = "Unknown";
                break;
        }

        const ordersCount = allOrders.length;
        const orderCountElement = document.querySelector(".header span");
        if (orderCountElement) {
            orderCountElement.innerText = ordersCount;
        }

        row.innerHTML = `
        <td>
            <div class="flex items-center">
                <input type="checkbox" class="w-4 h-4 text-primary-600 bg-gray-100 rounded border-gray-300 focus:ring-primary-500">
            </div>
        </td>
            <th>${order.name}</th>
            <td><span class="status ${statusClass}">${statusText}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td class="custom-td">
                <div class="flex">
                    <div class="circlered"></div>
                    ${order.paymentMethod} on delivery
                </div>
            </td>
            <td>${order.price} Egy</td>
            <td>${Math.floor(order.priceAfterDiscount - order.price)} Egy</td>
            <td>${order.priceAfterDiscount} Egy</td>
            <td class="custom-tdd">
                <div class="flex">
                    <button type="button" class="preview-button"  onclick="viewOrder('${order._id}')">
                        <svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 24 24" fill="currentColor">
                            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" />
                        </svg>
                     Preview
                    </button>
                </div>
            </td>
        `;
        ordersTableBody.appendChild(row);
    });
}

function viewOrder(orderId) {
    ViewModalOrder();

    fetch(`https://iti-js-project-backend.vercel.app/api/order/${orderId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                const order = data.order;
                document.getElementById("order-items").innerHTML = order.items
                    .map(
                        (item) => `
                        <div class="order-item">
                        <img src="${item.product.mainImage}" alt="${item.product.name}" class="order-item-img">
                        <div class="order-item-details">
                        <p><span class="label">Name: </span>${item.product.name}</p>
                        <p><span class="label">Description: </span>${item.product.description}</p>
                        <p><span class="label">Quantity: </span>${item.quantity}</p>
                        <p><span class="label">Price: </span>${item.product.price} Egy</p>
                        </div>
                        </div>
                    `
                    )
                    .join("");

                const userDetails = `
                    <p><strong>Name:</strong> ${order.name}</p>
                    <p><strong>Email:</strong> ${order.email}</p>
                    <p><strong>Phone:</strong> ${order.phone}</p>
                    <p><strong>Address:</strong> ${order.address}</p>`;
                document.querySelector(".user-info").innerHTML = userDetails;

                const orderoverView = `
                <div class="order-summary-item">
                    <span>Total Price:</span>
                    <span class="total-price">$${order.price}</span>
                </div>
                <div class="order-summary-item">
                    <span>Discount:</span>
                    <span class="discount">-$10.00</span>
                </div>
                <div class="order-summary-item">
                    <span><strong>Final Total:</strong></span>
                    <span class="final-total">$${order.priceAfterDiscount}</span>
                </div>
                `;
                document.querySelector(".order-summary").innerHTML = orderoverView;

                const actions = `
                 <button onclick="approveOrder('${order._id}')">Approve</button>
                <button onclick="declineOrder('${order._id}')">Decline</button>
                `;

                document.querySelector(".order-actions").innerHTML = actions;
            }
        })
        .catch((error) => console.error("Error:", error));
}

function updateOrderStatus(orderId, status) {
    fetch(`https://iti-js-project-backend.vercel.app/api/order/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ orderId: orderId, status: status }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                alert("Order status updated successfully");
                closeModalOrder();

                const updatedOrder = allOrders.find((order) => order._id === orderId);
                if (updatedOrder) {
                    updatedOrder.status = status;
                }

                renderOrders(allOrders);
            } else {
                alert(`Failed to update order status: ${data.message}`);
            }
        })
        .catch((error) => console.error("Error:", error));
}

function approveOrder(orderId) {
    updateOrderStatus(orderId, "approved");
}

function declineOrder(orderId) {
    updateOrderStatus(orderId, "declined");
}
