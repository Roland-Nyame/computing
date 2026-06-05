const products = [
  { id: 1, name: "Jollof Rice", category: "Local", price: 45.00, image: "images/jollof rice.jpg" },
  { id: 2, name: "Waakye with Meat", category: "Local", price: 35.00, image: "images/waakye.jpg" },
  { id: 3, name: "Fufu & Soup", category: "Local", price: 50.00, image: "images/fufu.jpg" },
  { id: 4, name: "Grilled Tilapia", category: "Local", price: 65.00, image: "images/grilled-tilapia.jpg" },
  { id: 5, name: "Margherita Pizza", category: "Foreign", price: 55.00, image: "images/margherita-pizza.jpg" },
  { id: 6, name: "Spaghetti Carbonara", category: "Foreign", price: 48.00, image: "images/spaghetti-carbonara.jpg" },
  { id: 7, name: "Fried Rice", category: "MainCourse", price: 40.00, image: "images/fried-rice.jpg" },
  { id: 8, name: "Chicken Stir Fry", category: "MainCourse", price: 58.00, image: "images/chicken-stir-fry.jpg" },
  { id: 9, name: "Spring Rolls", category: "Appetizers", price: 28.00, image: "images/spring-rolls.jpg" },
  { id: 10, name: "Grilled Shrimp", category: "Appetizers", price: 42.00, image: "images/grilled-shrimp.jpg" },
  { id: 11, name: "Chocolate Cake", category: "Desserts", price: 32.00, image: "images/chocolate-cake.jpg" },
  { id: 12, name: "Ice Cream Sundae", category: "Desserts", price: 25.00, image: "images/ice-cream-sundae.jpg" },
  { id: 13, name: "Fresh Orange Juice", category: "Beverages", price: 18.00, image: "images/orange-juice.jpg" },
  { id: 14, name: "Iced Tea", category: "Beverages", price: 15.00, image: "images/iced-tea.jpg" },
  { id: 15, name: "French Fries", category: "Snacks", price: 20.00, image: "images/french-fries.jpg" },
  { id: 16, name: "Chicken Wings", category: "Snacks", price: 38.00, image: "images/chicken-wings.jpg" }
];

const deliveryFee = 15.99;
let cart = JSON.parse(localStorage.getItem("groceryCart")) || [];
let filteredProducts = [...products];

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const openCartBtn = document.getElementById("openCartBtn");
const heroCartBtn = document.getElementById("heroCartBtn");
const mobileCartBtn = document.getElementById("mobileCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutItems = document.getElementById("checkoutItems");
const checkoutSubtotal = document.getElementById("checkoutSubtotal");
const checkoutDelivery = document.getElementById("checkoutDelivery");
const checkoutTotal = document.getElementById("checkoutTotal");
const checkoutForm = document.getElementById("checkoutForm");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const sortProducts = document.getElementById("sortProducts");
const productResultText = document.getElementById("productResultText");
const categoryButtons = document.querySelectorAll(".category-card");
const receiptModal = document.getElementById("receiptModal");
const receiptContent = document.getElementById("receiptContent");
const printReceiptBtn = document.getElementById("printReceiptBtn");
const closeReceiptBtn = document.getElementById("closeReceiptBtn");
const checkoutBtn = document.getElementById("checkoutBtn");

function formatCurrency(amount) {
  return `GHS ${amount.toFixed(2)}`;
}

function saveCart() {
  localStorage.setItem("groceryCart", JSON.stringify(cart));
}

function renderProducts(items = filteredProducts) {
  productGrid.innerHTML = "";

  if (items.length === 0) {
    productGrid.innerHTML = `<div class="empty-state"><h3>No products found</h3><p>Try another search or category.</p></div>`;
    productResultText.textContent = "No products found";
    return;
  }

  productResultText.textContent = `Showing ${items.length} product${items.length > 1 ? "s" : ""}`;

  items.forEach(product => {
    const productCard = document.createElement("article");
    productCard.className = "product-card";
    const imageHtml = product.image.startsWith('images/') 
      ? `<img src="${product.image}" alt="${product.name}" style="width:100%; height:100%; object-fit:cover;" />`
      : `<div style="font-size: 64px;">${product.image}</div>`;
    productCard.innerHTML = `
      <span class="product-badge">Fast Delivery</span>
      <div class="product-image">${imageHtml}</div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3>${product.name}</h3>
        <div class="product-price">${formatCurrency(product.price)}</div>
        <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
    productGrid.appendChild(productCard);
  });
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) existingItem.quantity += 1;
  else cart.push({ ...product, quantity: 1 });

  saveCart();
  updateCartUI();
  openCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function increaseQuantity(productId) {
  const item = cart.find(item => item.id === productId);
  if (item) item.quantity += 1;
  saveCart();
  updateCartUI();
}

function decreaseQuantity(productId) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  if (item.quantity > 1) item.quantity -= 1;
  else return removeFromCart(productId);

  saveCart();
  updateCartUI();
}

function getSubtotal() {
  return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function getTotal() {
  return cart.length === 0 ? 0 : getSubtotal() + deliveryFee;
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="empty-cart"><h4>Your cart is empty</h4><p>Add products to begin your grocery order.</p></div>`;
  } else {
    cart.forEach(item => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";
      const imageHtml = item.image.startsWith('images/')
        ? `<img src="${item.image}" alt="${item.name}" style="width:100%; height:100%; object-fit:cover; border-radius: 10px;" />`
        : `<div style="font-size: 24px; display: grid; place-items: center;">${item.image}</div>`;
      cartItem.innerHTML = `
        <div class="cart-item-image">${imageHtml}</div>
        <div>
          <h4>${item.name}</h4>
          <div class="cart-item-price">${formatCurrency(item.price)} x ${item.quantity}</div>
          <div class="cart-controls">
            <button onclick="decreaseQuantity(${item.id})">−</button>
            <strong>${item.quantity}</strong>
            <button onclick="increaseQuantity(${item.id})">+</button>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
          </div>
        </div>
      `;
      cartItems.appendChild(cartItem);
    });
  }

  cartTotal.textContent = formatCurrency(getTotal());
  updateCheckoutSummary();
}

function updateCheckoutSummary() {
  checkoutItems.innerHTML = "";

  if (cart.length === 0) {
    checkoutItems.innerHTML = `<p class="empty-checkout">No items in cart yet.</p>`;
  } else {
    cart.forEach(item => {
      const checkoutItem = document.createElement("div");
      checkoutItem.className = "checkout-item";
      checkoutItem.innerHTML = `
        <div><strong>${item.name}</strong><br><span>Qty: ${item.quantity}</span></div>
        <strong>${formatCurrency(item.price * item.quantity)}</strong>
      `;
      checkoutItems.appendChild(checkoutItem);
    });
  }

  checkoutSubtotal.textContent = formatCurrency(getSubtotal());
  checkoutDelivery.textContent = cart.length === 0 ? formatCurrency(0) : formatCurrency(deliveryFee);
  checkoutTotal.textContent = formatCurrency(getTotal());
}

function openCart() {
  cartDrawer.classList.add("show");
  cartOverlay.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("show");
  cartOverlay.classList.remove("show");
}

function filterByCategory(category) {
  filteredProducts = category === "all" ? [...products] : products.filter(product => product.category === category);
  sortCurrentProducts();
  renderProducts(filteredProducts);
}

function searchProducts() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm) || product.category.toLowerCase().includes(searchTerm));
  categoryButtons.forEach(button => button.classList.remove("active"));
  sortCurrentProducts();
  renderProducts(filteredProducts);
}

function sortCurrentProducts() {
  const sortValue = sortProducts.value;
  if (sortValue === "low-high") filteredProducts.sort((a, b) => a.price - b.price);
  if (sortValue === "high-low") filteredProducts.sort((a, b) => b.price - a.price);
}

function generateOrderNumber() {
  const date = new Date();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `FM-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${random}`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
}

function generateReceipt(orderData) {
  const subtotal = getSubtotal();
  const total = getTotal();
  const orderNumber = generateOrderNumber();
  const orderDate = new Date().toLocaleString();

  const productRows = cart.map(item => `
    <tr>
      <td>${escapeHTML(item.name)}</td>
      <td>${item.quantity}</td>
      <td>${formatCurrency(item.price * item.quantity)}</td>
    </tr>
  `).join("");

  receiptContent.innerHTML = `
    <div class="receipt-header">
      <h2>Team Oheneba Food HUB</h2>
      <p>Elmina, Ghana</p>
      <p>Phone: +233 53 674 5748 | Email: rolandnyame613@gmail.com</p>
    </div>
    <div class="receipt-meta">
      <div><strong>Receipt No:</strong><br>${orderNumber}</div>
      <div><strong>Date:</strong><br>${orderDate}</div>
      <div><strong>Payment Method:</strong><br>${escapeHTML(orderData.paymentMethod)}</div>
      <div><strong>Status:</strong><br>Order Received</div>
    </div>
    <div class="receipt-customer">
      <h3>Customer Details</h3>
      <p><strong>Name:</strong> ${escapeHTML(orderData.name)}</p>
      <p><strong>Phone:</strong> ${escapeHTML(orderData.phone)}</p>
      <p><strong>Email:</strong> ${escapeHTML(orderData.email || "N/A")}</p>
      <p><strong>Delivery Address:</strong> ${escapeHTML(orderData.address)}</p>
    </div>
    <table class="receipt-table">
      <thead><tr><th>Product</th><th>Qty</th><th>Total</th></tr></thead>
      <tbody>${productRows}</tbody>
      <tfoot>
        <tr><td colspan="2">Subtotal</td><td>${formatCurrency(subtotal)}</td></tr>
        <tr><td colspan="2">Delivery Fee</td><td>${formatCurrency(deliveryFee)}</td></tr>
        <tr class="receipt-total-row"><td colspan="2">Grand Total</td><td>${formatCurrency(total)}</td></tr>
      </tfoot>
    </table>
    <div class="receipt-note"><p>Thank you for shopping with us.</p><p>Your order has been received successfully.</p></div>
  `;
}

function openReceipt() { receiptModal.classList.add("show"); }
function closeReceipt() { receiptModal.classList.remove("show"); }
function clearOrder() { cart = []; saveCart(); updateCartUI(); checkoutForm.reset(); }

openCartBtn.addEventListener("click", openCart);
heroCartBtn.addEventListener("click", openCart);
mobileCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);
checkoutBtn.addEventListener("click", closeCart);
searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("keyup", event => {
  if (event.key === "Enter") searchProducts();
  if (searchInput.value.trim() === "") {
    filteredProducts = [...products];
    sortCurrentProducts();
    renderProducts(filteredProducts);
  }
});

sortProducts.addEventListener("change", () => {
  sortCurrentProducts();
  renderProducts(filteredProducts);
});

categoryButtons.forEach(button => {
  button.addEventListener("click", () => {
    categoryButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");
    searchInput.value = "";
    filterByCategory(button.dataset.category);
  });
});

checkoutForm.addEventListener("submit", event => {
  event.preventDefault();
  if (cart.length === 0) {
    alert("Your cart is empty. Please add products before checkout.");
    return;
  }

  const orderData = {
    name: document.getElementById("customerName").value.trim(),
    phone: document.getElementById("customerPhone").value.trim(),
    email: document.getElementById("customerEmail").value.trim(),
    address: document.getElementById("deliveryAddress").value.trim(),
    paymentMethod: document.getElementById("paymentMethod").value
  };

  generateReceipt(orderData);
  openReceipt();
  clearOrder();
});

printReceiptBtn.addEventListener("click", () => window.print());
closeReceiptBtn.addEventListener("click", closeReceipt);
receiptModal.addEventListener("click", event => { if (event.target === receiptModal) closeReceipt(); });

renderProducts();
updateCartUI();
