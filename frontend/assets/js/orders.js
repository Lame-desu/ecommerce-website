/**
 * Get orders from localStorage.
 * @returns {Array} The saved orders.
 */
function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

/**
 * Save orders to localStorage.
 * @param {Array} orders - The orders to save.
 */
function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

/**
 * Display orders in the orders container.
 */
function displayOrders() {
  const orders = getOrders();
  const ordersContainer = document.getElementById("orders-container");

  if (!ordersContainer) {
    console.error("Orders container not found.");
    return;
  }

  if (orders.length === 0) {
    ordersContainer.innerHTML = `
        <div class="text-center">
          <p>You have no orders. Add items to your cart and check them out!</p>
        </div>`;
    return;
  }

  ordersContainer.innerHTML = orders
    .map((order) => {
      const productList = order.products
        .map(
          (product) => `
            <li class="list-group-item d-flex justify-content-between align-items-center">
              <span>${product.title} (x${product.quantity || 1})</span>
              <span>$${product.price.toFixed(2)}</span>
            </li>`
        )
        .join("");

      return `
          <div class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Order #${order.id}</h5>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Shipping to:</strong> ${order.user.address}</p>
              <h6>Products:</h6>
              <ul class="list-group mb-3">
                ${productList}
              </ul>
              <button class="btn btn-success mark-received-btn" data-order-id="${order.id}">
                Mark as Received
              </button>
            </div>
          </div>`;
    })
    .join("");

  // Add event listeners for "Mark as Received" buttons
  document.querySelectorAll(".mark-received-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      const orderId = parseInt(e.target.getAttribute("data-order-id"), 10);
      markOrderAsReceived(orderId);
    });
  });
}

/**
 * Mark an order as received and remove it.
 * @param {number} orderId - The ID of the order to remove.
 */
function markOrderAsReceived(orderId) {
  if (confirm("Are you sure you want to mark this order as received?")) {
    const orders = getOrders().filter((order) => order.id !== orderId);
    saveOrders(orders);
    alert("Thank you! Your order has been marked as received.");
    displayOrders();
  }
}

// Initialize the orders page
document.addEventListener("DOMContentLoaded", () => {
  displayOrders();
});
