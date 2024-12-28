var API_URL = "https://iti-js-project-backend.vercel.app/api/wishlist";
var token ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzY4NmY4MzdhZTBkODk2ZGYzZGIyZTkiLCJyb2xlIjoidXNlciIsImlhdCI6MTczNDkxMTQyMywiZXhwIjoxNzM0OTE1MDIzfQ.yGP-GlZer8Pqu9XhlzjDvADPYE31A2Ya-kMVae6SFSM";

async function fetchWishlist() {
  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  const wishlistItems = data.wishlist.products;

  const wishlist = document.getElementById("wishlist");
  wishlist.innerHTML = "";

  wishlistItems.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><img src="${item.mainImage}" alt="${item.name}"></td>
      <td>${item.name}</td>
      <td>${item.price}$</td>
      <td><button class="remove-btn" onclick="removeFromWishlist('${item._id}')">&times;</button></td>
    `;
    wishlist.appendChild(row);
  });
}

async function removeFromWishlist(id) {
  await fetch(`${API_URL}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ productId: id }),
  });
  fetchWishlist();
}

fetchWishlist();
