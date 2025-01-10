import { fetchCartProducts } from "../fetch-api/api.js";
import { getCart } from "./updateCartBadge.js";

function showSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "flex";
}

function hideSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "none";
}

// Save the cart to localStorage
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}
/**
 * Save orders to localStorage.
 * @param {Array} orders - The orders to save.
 */
function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}
/**
 * Get orders from localStorage.
 * @returns {Array} The saved orders.
 */
function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

// Fetch product details for the cart
// async function fetchCartProducts(cart) {
//   const promises = cart.map((item) =>
//     fetch(`https://fakestoreapi.com/products/${item.id}`).then((res) =>
//       res.json()
//     )
//   );
//   return Promise.all(promises);
// }

/**
 * Display the cart summary on the checkout page.
 */
async function displayCheckoutSummary() {
  const cart = getCart();
  const summaryContainer = document.getElementById("checkout-summary");
  const form = document.getElementById("checkout-form");

  if (!summaryContainer) {
    console.error("Checkout summary container not found.");
    return;
  }

  if (cart.length === 0) {
    form.style.display = "none";
    summaryContainer.innerHTML = `
        <div class="text-center">
          <p>Your cart is empty. Go back to products and add some items.</p>
        </div>`;
    return;
  }
  form.style.display = "block";
  showSpinner();
  const products = await fetchCartProducts(cart);
  hideSpinner();
  let total = 0;

  summaryContainer.innerHTML = `
      <h4>Order Summary</h4>
      <ul class="list-group mb-4">
        ${products
          .map((product, index) => {
            const item = cart[index];
            const subtotal = item.quantity * product.price;
            total += subtotal;

            return `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>${product.title} (x${item.quantity})</span>
              <span>$${subtotal.toFixed(2)}</span>
            </li>`;
          })
          .join("")}
        <li class="list-group-item d-flex justify-content-between align-items-center fw-bold">
          <span>Total</span>
          <span>$${total.toFixed(2)}</span>
        </li>
      </ul>`;
}

/**
 * Handle form submission and finalize the order.
 */
function handleCheckoutFormSubmission() {
  const form = document.getElementById("checkout-form");

  if (!form) {
    console.error("Checkout form not found.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const paymentMethod = document.getElementById("payment-method").value;

    if (!name || !email || !address || !paymentMethod) {
      alert("Please fill in all required fields.");
      return;
    }

    // Simulate order submission
    const cart = getCart();
    if (cart.length === 0) {
      alert("Your cart is empty. Please add items to the cart.");
      return;
    }
    const products = await fetchCartProducts(cart);
    const order = {
      id: Date.now(),
      products,
      user: { name, email, address, paymentMethod },
      status: "Created",
    };
    const orders = getOrders();
    orders.push(order);
    saveOrders(orders);

    //
    alert(`Thank you for your order, ${name}! Your order has been placed.`);
    saveCart([]); // Clear the cart
    window.location.href = "./orders.html"; // Redirect to the products page
  });
}

// Initialize the checkout page
document.addEventListener("DOMContentLoaded", () => {
  displayCheckoutSummary();
  handleCheckoutFormSubmission();
});
