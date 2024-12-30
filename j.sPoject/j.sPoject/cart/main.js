// https://iti-js-project-backend.vercel.app/api/products/

// ===================
// ====================


const url = 'https://iti-js-project-backend.vercel.app/api/cart';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZlZjhkNjVkNzU0NTRhNWY0MGUyNTQiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNTMzNjc3NSwiZXhwIjoxNzM1OTQxNTc1fQ.ts6sV0HH4pCEBRfilS_3RDBOEhouVcQUOO0NYZjFGgU";

// Get the products from the cart
fetch(url, {
  method: 'GET', 
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
})
.then(response => response.json())
.then(data => {
    const items = data.cart.items; // Access the items from the response
    const container = document.getElementById('product-container'); 
      console.log(items);
      
    items.forEach(item => {
      const productHTML = `
        <div class="product" data-product-id="${item.product._id}">
          <div class="product-image">
            <img src="${item.product.mainImage}" alt="${item.product.name}">
          </div>
          <div class="product-details">
            <div class="product-title"><strong>${item.product.name}</strong></div>
            <p class="product-description">${item.product.description}</p>
          </div>
          <div class="product-price">${item.product.price}</div>
          <div class="product-quantity">
            <input type="number" value="${item.quantity}" min="1">
          </div>
          <div class="product-removal">
            <button class="remove-product">Remove</button>
          </div>
          <div class="product-line-price">${(item.product.price * item.quantity).toFixed(2)}</div>
        </div>
      `;
  
      container.innerHTML += productHTML; 
    });

    // Attach event listeners to "Remove" buttons
    const removeButtons = document.querySelectorAll('.remove-product');
    removeButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        const productElement = event.target.closest('.product');
        const productId = productElement.dataset.productId;

        // Sending DELETE request to remove the product
        fetch(url, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: productId }) // Send the productId in the body
        })
        .then(response => {
          if (response.ok) {
            // Remove the product element from the DOM
            productElement.remove();
            console.log(`Product with ID ${productId} removed successfully.`);
          } else {
            console.error('Failed to remove product:', response.statusText);
          }
        })
        .catch(error => {
          console.error('Error:', error);
        });
      });
    });
})
.catch(error => {
  console.error('Error:', error); 
});
// ==================
// ==================

