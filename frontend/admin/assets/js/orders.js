// Mock data for orders
const orders = [
  {
    id: 1,
    status: "pending",
    user: "John Doe",
    address: "123 Main St, New York, NY",
    products: [
      { id: 1, title: "Product A", price: 20.0, quantity: 2 },
      { id: 2, title: "Product B", price: 15.5, quantity: 1 },
    ],
  },
  {
    id: 2,
    status: "received",
    user: "Jane Smith",
    address: "456 Elm St, Los Angeles, CA",
    products: [
      { id: 3, title: "Product C", price: 30.0, quantity: 1 },
      { id: 4, title: "Product D", price: 10.0, quantity: 3 },
    ],
  },
];

/**
 * Display orders in the orders container.
 */
function displayOrders() {
  const ordersContainer = document.getElementById("orders-container");

  if (!ordersContainer) {
    console.error("Orders container not found.");
    return;
  }

  ordersContainer.innerHTML = orders
    .map((order) => createOrderCard(order))
    .join("");
}

/**
 * Create an order card with all details.
 * @param {Object} order - The order data.
 * @returns {string} HTML string for the order card.
 */
function createOrderCard(order) {
  const total = order.products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const productList = order.products
    .map(
      (product) => `
        <li>
          <span>${product.title} (x${product.quantity})</span>
          <span>$${(product.price * product.quantity).toFixed(2)}</span>
        </li>
      `
    )
    .join("");

  return `
      <div class="col-md-6">
        <div class="card order-card">
          <div class="order-header">
            Order #${order.id} - <span class="status-badge status-${
    order.status
  }">${order.status}</span>
          </div>
          <div class="card-body">
            <p><strong>User:</strong> ${order.user}</p>
            <p><strong>Address:</strong> ${order.address}</p>
            <p><strong>Products:</strong></p>
            <ul class="product-list">
              ${productList}
            </ul>
            <p class="mt-3"><strong>Total:</strong> $${total.toFixed(2)}</p>
          </div>
        </div>
      </div>`;
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  displayOrders();
});
