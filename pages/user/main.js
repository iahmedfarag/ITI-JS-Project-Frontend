import { toggleAuthLinks, toggleLoader, updateCartQuantity } from "../../js/generalFunctions.js";

let orders = [];

// Fetch orders from the API
async function fetchOrders() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        alert("You need to log in to view your orders.");
        window.location.href = "/";
        return;
    }

    try {
        const response = await fetch("https://iti-js-project-backend.vercel.app/api/order", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }

        orders = await response.json();
    } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to fetch orders. Please try again later.");
    }
}

// Render orders into the table
function loadOrders() {
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
        window.location.href = "/";
        return;
    }

    const orderTbody = document.getElementById("order-tbody");
    orderTbody.innerHTML = ""; // Clear existing rows

    if (!orders || orders.orders.length === 0) {
        orderTbody.innerHTML = `<tr><td colspan="6" class="empty-state">No orders found. Start shopping now!</td></tr>`;
        return;
    }

    orders.orders.forEach((order) => {
        // Main row for the order
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${order._id}</td>
            <td>$${order.price.toFixed(2)}</td>
            <td>${(order.price - order.priceAfterDiscount).toFixed(2)}%</td>
            <td>$${order.priceAfterDiscount.toFixed(2)}</td>
            <td>
                <span class="status-circle ${order.status}">${order.status}</span>
            </td>
            <td>
                <button class="accordion">Details</button>
            </td>
        `;

        orderTbody.appendChild(row);

        // Accordion content
        const accordionContent = document.createElement("tr");
        accordionContent.className = "details-accordion";
        accordionContent.id = `${order._id}-details`;
        accordionContent.style.display = "none";

        const accordionTd = document.createElement("td");
        accordionTd.colSpan = 6;

        const contentTable = document.createElement("table");
        contentTable.className = "tiny-table";

        order.items.forEach((item) => {
            const product = item.product;
            const productRow = document.createElement("tr");

            productRow.innerHTML = `
                <td><img src="${product.mainImage || "/furniture10-88x100.jpg"}" alt="${product.name}" style="width: 70px; height: 70px;"></td>
                <td>${product.name}</td>
                <td>Quantity: ${item.quantity}</td>
                <td>$${(product.price * item.quantity).toFixed(2)}</td>
                <td>${order.paymentMethod}</td>
            `;

            contentTable.appendChild(productRow);
        });

        accordionTd.appendChild(contentTable);
        accordionContent.appendChild(accordionTd);
        orderTbody.appendChild(accordionContent);

        // Add accordion toggle functionality
        const detailsButton = row.querySelector(".accordion");
        detailsButton.addEventListener("click", () => toggleAccordion(order._id, detailsButton));
    });
}

// Toggle accordion visibility
function toggleAccordion(orderId, button) {
    const accordionContent = document.getElementById(`${orderId}-details`);

    if (accordionContent.style.display === "table-row") {
        accordionContent.style.display = "none";
        button.classList.remove("accordion-active");
    } else {
        document.querySelectorAll(".details-accordion").forEach((accordion) => {
            accordion.style.display = "none";
        });

        accordionContent.style.display = "table-row";
        button.classList.add("accordion-active");
    }
}

// Initialize orders on page load
document.addEventListener("DOMContentLoaded", async () => {
    toggleLoader(true);
    toggleAuthLinks();
    updateCartQuantity();
    await fetchOrders();
    loadOrders();

    toggleLoader(false);
});
