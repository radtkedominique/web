
// Shopping Cart Functionality
document.addEventListener('DOMContentLoaded', function () {
const cartContainer = document.getElementById('cart-container');
const cartDropdown = document.getElementById('cart-dropdown');
const cartItemsContainer = document.getElementById('cart-items');
const cartCountElement = document.getElementById('cart-count');
const cartTotalElement = document.getElementById('cart-total');
const emptyCartElement = document.getElementById('empty-cart');
const cartTotalContainer = document.getElementById('cart-total-container');
const cartButtons = document.getElementById('cart-buttons');
const clearCartButton = document.getElementById('clear-cart');
const checkoutButton = document.getElementById('checkout');
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.querySelector('.nav-menu');

// Cart object to store the cart data
let cart = {
items: [],
total: 0
};

// Toggle mobile menu
mobileToggle?.addEventListener('click', function () {
navMenu.classList.toggle('active');
});

// Toggle cart dropdown
cartContainer?.addEventListener('click', function (e) {
e.stopPropagation();
cartDropdown.classList.toggle('active');
});

// Close cart dropdown when clicking outside
document.addEventListener('click', function (e) {
if (cartContainer && !cartContainer.contains(e.target)) {
cartDropdown.classList.remove('active');
}
});

// Initialize product cards with data attributes
function initializeProductCards() {
const productCards = document.querySelectorAll('.product-card');

productCards.forEach(card => {
const addButton = card.querySelector('.add-to-cart');
const titleElement = card.querySelector('.product-title');
const priceElement = card.querySelector('.product-price');

if (addButton && titleElement && priceElement) {
const productId = 'product_' + Math.random().toString(36).substr(2, 9); // Generate a unique ID
const productName = titleElement.textContent;
const productPrice = parseFloat(priceElement.textContent.replace(/[^0-9.]/g, ''));

addButton.setAttribute('data-id', productId);
addButton.setAttribute('data-name', productName);
addButton.setAttribute('data-price', productPrice);
}
});
}

// Add to cart functionality
function setupAddToCartButtons() {
const buttons = document.querySelectorAll('.add-to-cart');

buttons.forEach(button => {
button.addEventListener('click', function(e) {
e.preventDefault();

const id = this.getAttribute('data-id');
const name = this.getAttribute('data-name');
const price = parseFloat(this.getAttribute('data-price'));

if (id && name && !isNaN(price)) {
addItemToCart(id, name, price);
updateCartUI();

// Show cart dropdown
cartDropdown.classList.add('active');

// Animation feedback
const originalText = this.innerHTML;
this.innerHTML = '<i class="fas fa-check"></i> Added!';
setTimeout(() => {
this.innerHTML = originalText;
}, 1000);
} else {
console.error('Missing product data:', { id, name, price });
}
});
});
}

// Add item to cart
function addItemToCart(id, name, price) {
const existingItem = cart.items.find(item => item.id === id);

if (existingItem) {
existingItem.quantity += 1;
} else {
cart.items.push({
id: id,
name: name,
price: price,
quantity: 1
});
}

// Update cart total
calculateCartTotal();

// Save cart to localStorage
saveCart();
}

// Remove item from cart
function removeItemFromCart(id) {
cart.items = cart.items.filter(item => item.id !== id);
calculateCartTotal();
saveCart();
updateCartUI();
}

// Update item quantity
function updateItemQuantity(id, quantity) {
const item = cart.items.find(item => item.id === id);

if (item) {
item.quantity = parseInt(quantity);

// If quantity is 0 or less, remove the item
if (item.quantity <= 0) {
removeItemFromCart(id);
return;
}
}

calculateCartTotal();
saveCart();
updateCartUI();
}

// Calculate cart total
function calculateCartTotal() {
cart.total = cart.items.reduce((total, item) => {
return total + (item.price * item.quantity);
}, 0);
}

// Update cart UI
function updateCartUI() {
// Update cart count
const totalItems = cart.items.reduce((count, item) => count + item.quantity, 0);
cartCountElement.innerText = totalItems;

// Update cart items UI
cartItemsContainer.innerHTML = '';

if (cart.items.length === 0) {
cartItemsContainer.appendChild(emptyCartElement);
emptyCartElement.style.display = 'block';
cartTotalContainer.style.display = 'none';
cartButtons.style.display = 'none';
return;
}

emptyCartElement.style.display = 'none';
cartTotalContainer.style.display = 'flex';
cartButtons.style.display = 'flex';

// Add each item to the cart UI
cart.items.forEach(item => {
const cartItemElement = document.createElement('div');
cartItemElement.className = 'cart-item';
cartItemElement.innerHTML = `
<div class="cart-item-image">
<i class="fas fa-box"></i>
</div>
<div class="cart-item-details">
<div class="cart-item-title">${item.name}</div>
<div class="cart-item-price">${item.price.toFixed(2)} EUR</div>
</div>
<div class="cart-item-quantity">
<button class="quantity-btn minus" data-id="${item.id}">-</button>
<input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
<button class="quantity-btn plus" data-id="${item.id}">+</button>
</div>
<button class="cart-item-remove" data-id="${item.id}">
<i class="fas fa-trash"></i>
</button>
`;

cartItemsContainer.appendChild(cartItemElement);
});

// Update cart total
cartTotalElement.innerText = `${cart.total.toFixed(2)} EUR`;

// Add event listeners to quantity buttons and remove buttons
const minusButtons = cartItemsContainer.querySelectorAll('.minus');
const plusButtons = cartItemsContainer.querySelectorAll('.plus');
const quantityInputs = cartItemsContainer.querySelectorAll('.quantity-input');
const removeButtons = cartItemsContainer.querySelectorAll('.cart-item-remove');

minusButtons.forEach(button => {
button.addEventListener('click', function () {
const id = button.getAttribute('data-id');
const item = cart.items.find(item => item.id === id);
if (item && item.quantity > 1) {
updateItemQuantity(id, item.quantity - 1);
} else {
removeItemFromCart(id);
}
});
});

plusButtons.forEach(button => {
button.addEventListener('click', function () {
const id = button.getAttribute('data-id');
const item = cart.items.find(item => item.id === id);
if (item) {
updateItemQuantity(id, item.quantity + 1);
}
});
});

quantityInputs.forEach(input => {
input.addEventListener('change', function () {
const id = input.getAttribute('data-id');
const newQuantity = parseInt(input.value);
if (newQuantity > 0) {
updateItemQuantity(id, newQuantity);
} else {
input.value = 1;
updateItemQuantity(id, 1);
}
});
});

removeButtons.forEach(button => {
button.addEventListener('click', function () {
const id = button.getAttribute('data-id');
removeItemFromCart(id);
});
});
}

// Clear cart
clearCartButton?.addEventListener('click', function () {
cart.items = [];
calculateCartTotal();
saveCart();
updateCartUI();
});

// Checkout
checkoutButton?.addEventListener('click', function () {
alert('Proceeding to checkout with ' + cart.items.length + ' items worth ' + cart.total.toFixed(2) + ' EUR');
// Here you would typically redirect to a checkout page
});

// Save cart to localStorage
function saveCart() {
localStorage.setItem('shopping-cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
const savedCart = localStorage.getItem('shopping-cart');
if (savedCart) {
try {
cart = JSON.parse(savedCart);
updateCartUI();
} catch (e) {
console.error('Error loading cart from localStorage:', e);
localStorage.removeItem('shopping-cart');
}
}
}

// Initialize everything
initializeProductCards();
setupAddToCartButtons();
loadCart();
});
