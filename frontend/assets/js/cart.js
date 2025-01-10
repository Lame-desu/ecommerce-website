import { fetchCartProducts } from "../fetch-api/api.js";
import updateCartBadge from "./updateCartBadge.js";
import { getCart } from "./updateCartBadge.js";

function showSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "flex";
}

function hideSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "none";
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Display cart items and the total.
 */
async function displayCart() {
  const cart = getCart();
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalElement = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-btn");

  if (!cartItemsContainer || !cartTotalElement || !checkoutButton) {
    console.error("Cart elements not found.");
    return;
  }

  if (cart.length === 0) {
    // Show message and link to go back to products

    cartItemsContainer.innerHTML = `
      <div class="text-center">
        <p>Your cart is empty. Start adding some amazing products!</p>
      </div>`;
    cartTotalElement.textContent = "";
    checkoutButton.disabled = true;
    return;
  }
  // Display cart items
  showSpinner();
  const products = await fetchCartProducts(cart);
  hideSpinner();

  let total = 0;

  cartItemsContainer.innerHTML = products
    .map((product, index) => {
      const item = cart[index];
      const subtotal = item.quantity * product.price;
      total += subtotal;

      return `
          <div class="col-md-12">
            <div class="d-flex align-items-center justify-content-between border-bottom pb-3 mb-3">
              <div class="d-flex align-items-center">
                <img src="${product.image}" alt="${
        product.title
      }" style="width: 100px; height: auto; object-fit: contain;">
                <div class="ms-3">
                  <h5>${product.title}</h5>
                  <p class="text-success">$${product.price.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <input type="number" min="1" value="${
                  item.quantity
                }" class="form-control cart-quantity" data-product-id="${
        item.id
      }">
              </div>
              <p class="fw-bold">$${subtotal.toFixed(2)}</p>
              <button class="btn btn-danger btn-sm remove-cart-item" data-product-id="${
                item.id
              }">Remove</button>
            </div>
          </div>`;
    })
    .join("");

  cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;
  checkoutButton.disabled = false;
  if (!checkoutButton.disabled) {
    checkoutButton.addEventListener("click", function () {
      window.location.href = "checkout.html";
    });
  }

  // Event listeners for quantity changes and item removal
  document.querySelectorAll(".cart-quantity").forEach((input) => {
    input.addEventListener("change", (e) => {
      const productId = parseInt(e.target.getAttribute("data-product-id"), 10);
      const newQuantity = parseInt(e.target.value, 10);
      updateCartQuantity(productId, newQuantity);
      displayCart();
    });
  });

  document.querySelectorAll(".remove-cart-item").forEach((button) => {
    button.addEventListener("click", (e) => {
      const productId = parseInt(e.target.getAttribute("data-product-id"), 10);
      removeFromCart(productId);
      displayCart();
    });
  });
}

/**
 * Update the quantity of an item in the cart.
 * @param {number} productId - The ID of the product.
 * @param {number} quantity - The new quantity.
 */
function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.quantity = quantity > 0 ? quantity : 1;
    saveCart(cart);
    updateCartBadge();
  }
}

/**
 * Remove an item from the cart.
 * @param {number} productId - The ID of the product to remove.
 */
function removeFromCart(productId) {
  const cart = getCart().filter((item) => item.id !== productId);
  saveCart(cart);
  updateCartBadge();
}

// Initialize the cart
document.addEventListener("DOMContentLoaded", () => {
  displayCart();
});
