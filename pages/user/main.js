var API_URL = "https://iti-js-project-backend.vercel.app/api/order";
var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZkYjVhNjU0YmExMzM5OTRiN2I1ZTUiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNTMyODUwNCwiZXhwIjoxNzM1OTMzMzA0fQ.v69lBtkvrcgbhKlfrIeLWQnuM_P5LCw5vzAWveZ5fEk"; // Replace with your actual token
var orders;

async function fetchOrders() {
    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        orders = await response.json();
    } catch (error) {
        console.error(error);
    }
}
function loadOrders() {
    const orderTbody = document.getElementById('order-tbody');
    orderTbody.innerHTML = '';

    orders.orders.forEach(order => {
        const row = document.createElement('tr');

        const orderIdCell = document.createElement('td');
        orderIdCell.textContent = order._id;
        row.appendChild(orderIdCell);

        const priceCell = document.createElement('td');
        priceCell.textContent = `$${order.price.toFixed(2)}`;
        row.appendChild(priceCell);

        const discountCell = document.createElement('td');
        discountCell.textContent = `${(order.price - order.priceAfterDiscount).toFixed(2)}%`;
        row.appendChild(discountCell);

        const priceAfterDiscountCell = document.createElement('td');
        priceAfterDiscountCell.textContent = `$${order.priceAfterDiscount.toFixed(2)}`;
        row.appendChild(priceAfterDiscountCell);

        const statusCell = document.createElement('td');
        const statusElement = document.createElement('span');
        statusElement.textContent = order.status;

        if (order.status === 'pending') {
            statusElement.classList.add('status-circle', 'pending');
        } else if (order.status === 'approved') {
            statusElement.classList.add('status-circle', 'approved');
        } else if (order.status === 'rejected') {
            statusElement.classList.add('status-circle', 'rejected');
        }

        statusCell.appendChild(statusElement);
        row.appendChild(statusCell);

        const detailsCell = document.createElement('td');
        const detailsButton = document.createElement('button');
        detailsButton.textContent = 'Details';
        detailsButton.classList.add('accordion');
        detailsButton.addEventListener('click', () => toggleAccordion(order._id, detailsButton, row));
        detailsCell.appendChild(detailsButton);
        row.appendChild(detailsCell);

        orderTbody.appendChild(row);

        const accordionContent = document.createElement('tr');
        accordionContent.className = 'details-accordion';
        accordionContent.id = `${order._id}-details`;
        accordionContent.style.display = 'none';

        const accordionTd = document.createElement('td');
        accordionTd.colSpan = 6;

        const contentTable = document.createElement('table');
        contentTable.className = 'tiny-table';

        order.items.forEach(item => {
            const product = item.product;
            const productRow = document.createElement('tr');

            const imageCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = product.mainImage || '/furniture10-88x100.jpg';
            img.alt = product.name;
            img.style.width = '70px';
            img.style.height = '70px';
            imageCell.appendChild(img);
            productRow.appendChild(imageCell);

            const nameCell = document.createElement('td');
            nameCell.textContent = product.name;
            productRow.appendChild(nameCell);

            const quantityCell = document.createElement('td');
            quantityCell.textContent = `Quantity: ${item.quantity}`;
            productRow.appendChild(quantityCell);

            const priceCell = document.createElement('td');
            priceCell.textContent = `$${(product.price * item.quantity).toFixed(2)}`;
            productRow.appendChild(priceCell);

            const paymentCell = document.createElement('td');
            paymentCell.textContent = order.paymentMethod;
            productRow.appendChild(paymentCell);

            contentTable.appendChild(productRow);
        });

        accordionTd.appendChild(contentTable);
        accordionContent.appendChild(accordionTd);
        orderTbody.appendChild(accordionContent);
    });
}


function toggleAccordion(orderId, button, row) {
    const accordionContent = document.getElementById(`${orderId}-details`);

    if (accordionContent.style.display === 'table-row') {
        accordionContent.style.display = 'none';
        button.classList.remove('accordion-active');
    } else {
        const allAccordions = document.querySelectorAll('.details-accordion');
        allAccordions.forEach(acc => acc.style.display = 'none');

        accordionContent.style.display = 'table-row';
        button.classList.add('accordion-active');
    }
}
document.querySelectorAll('.accordion-btn').forEach(button => {
    button.addEventListener('click', function () {
        const row = this.closest('tr');
        const details = row.nextElementSibling;

        details.classList.toggle('details-accordion');
        this.classList.toggle('accordion-active');
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    await fetchOrders();
    loadOrders();
});
