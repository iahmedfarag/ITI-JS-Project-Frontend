/* Set rates + misc */
const taxRate = 0.05;
const shippingRate = 15.00; 
const fadeTime = 300;

/* Dynamically Fetch Products (Cart API) */
const url = 'https://iti-js-project-backend.vercel.app/api/cart';
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZlZjhkNjVkNzU0NTRhNWY0MGUyNTQiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNTMzNjc3NSwiZXhwIjoxNzM1OTQxNTc1fQ.ts6sV0HH4pCEBRfilS_3RDBOEhouVcQUOO0NYZjFGgU";
// get
// ================================
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
          <div class="product-price"> ${item.product.price}</div>
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
// Update
// ==========================================
document.querySelector('.checkout').addEventListener('click', function () {
  // Get all products in the cart
  const products = document.querySelectorAll('.product');
  const updatePromises = [];

  products.forEach(product => {
    const productId = product.getAttribute('data-product-id');
    const quantity = product.querySelector('.product-quantity input').value;

    // Prepare the PUT request
    const updatePromise = fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: productId,
        quantity: quantity
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(`Product ${productId} updated successfully:`, data);
    })
    .catch(error => {
      console.error(`Error updating product ${productId}:`, error);
    });

    updatePromises.push(updatePromise);
  });

  // Wait for all updates to complete
  Promise.all(updatePromises).then(() => {
    console.log('All products updated successfully.');
    alert('Cart updated successfully!');
  });
});

// =============================================
// =============================================


/* Recalculate cart */
function recalculateCart() {
  var subtotal = 0;
  
  /* Sum up row totals */
  document.querySelectorAll('.product').forEach(function(product) {
    subtotal += parseFloat(product.querySelector('.product-line-price').textContent);
  });
  
  /* Calculate totals */
  var tax = subtotal * taxRate;
  var shipping = (subtotal > 0 ? shippingRate : 0);
  var total = subtotal + tax + shipping;
  
  /* Update totals display */
  var totalsValue = document.querySelectorAll('.totals-value');
  totalsValue.forEach(function(totals) {
    totals.style.display = 'none';
  });

  setTimeout(function() {
    document.getElementById('cart-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('cart-tax').textContent = tax.toFixed(2);
    document.getElementById('cart-shipping').textContent = shipping.toFixed(2);
    document.getElementById('cart-total').textContent = total.toFixed(2);
    
    if (total === 0) {
      document.querySelector('.checkout').style.display = 'none';
    } else {
      document.querySelector('.checkout').style.display = 'block';
    }

    totalsValue.forEach(function(totals) {
      totals.style.display = 'block';
    });
  }, fadeTime);
}

/* Update quantity */
function updateQuantity(quantityInput) {
  /* Calculate line price */
  var productRow = quantityInput.closest('.product');
  var price = parseFloat(productRow.querySelector('.product-price').textContent);
  var quantity = quantityInput.value;
  var linePrice = price * quantity;
  
  /* Update line price display and recalc cart totals */
  var linePriceElement = productRow.querySelector('.product-line-price');
  linePriceElement.style.display = 'none';
  setTimeout(function() {
    linePriceElement.textContent = linePrice.toFixed(2);
    recalculateCart();
    linePriceElement.style.display = 'block';
  }, fadeTime);
}


