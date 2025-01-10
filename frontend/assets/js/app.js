import {
  fetchProductById,
  loadComponent,
  fetchCategories,
  fetchProducts,
} from "../fetch-api/api.js";
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

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("../components/header.html", "header-placeholder");
  await loadComponent("../components/footer.html", "footer-placeholder");
  // Initialize the cart badge on page load
  updateCartBadge();
});

/**
 * Display product categories as buttons, including an "ALL" button.
 */
async function displayCategories() {
  const categoriesContainer = document.getElementById("categories");

  if (!categoriesContainer) {
    console.error("Categories container element not found.");
    return;
  }

  try {
    const categories = await fetchCategories();

    // Add "ALL" button and other category buttons
    categoriesContainer.innerHTML = `
      <button class="btn btn-outline-primary mx-2 category-btn" data-category="all">ALL</button>
      ${categories
        .map(
          (category) => `
          <button class="btn btn-outline-primary mx-2 category-btn" data-category="${category}">
            ${category.charAt(0).toUpperCase() + category.slice(1)}
          </button>`
        )
        .join("")}`;

    // Add event listeners for category buttons
    document.querySelectorAll(".category-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const category = button.getAttribute("data-category");
        showSpinner();
        await displayProducts(category === "all" ? null : category);
        hideSpinner();
      });
    });
  } catch (error) {
    console.error("Error displaying categories:", error);
    categoriesContainer.innerHTML = `<p class="text-danger">Failed to load categories. Please try again later.</p>`;
  }
}

/**
 * Display products in the product grid or details of a single product.
 * @param {string|null} category - The category to fetch products for, or null for all products.
 */
async function displayProducts(category = null) {
  const productGrid = document.getElementById("product-grid");

  if (!productGrid) {
    console.error("Product grid element not found.");
    return;
  }

  try {
    const products = await fetchProducts(category);

    productGrid.innerHTML = products
      .map(
        (product) => `
        <div class="col-md-3">
          <div class="card h-100 shadow-sm">
            <img src="${product.image}" class="card-img-top" alt="${
          product.title
        }" style="height: 200px; object-fit: contain;">
            <div class="card-body">
              <h5 class="card-title text-truncate" title="${product.title}">${
          product.title
        }</h5>
              <p class="card-text text-success fw-bold">$${product.price.toFixed(
                2
              )}</p>
              <button class="btn btn-primary w-100 view-product-btn" data-product-id="${
                product.id
              }">View Details</button>
            </div>
          </div>
        </div>`
      )
      .join("");

    // Add event listeners for "View Details" buttons
    document.querySelectorAll(".view-product-btn").forEach((button) => {
      button.addEventListener("click", async () => {
        const productId = button.getAttribute("data-product-id");
        showSpinner();
        await displayProductDetails(productId);
        hideSpinner();
      });
    });
  } catch (error) {
    console.error("Error displaying products:", error);
    productGrid.innerHTML = `<p class="text-danger">Failed to load products. Please try again later.</p>`;
  }
}

/**
 * Display details of a single product.
 * @param {string} productId - The ID of the product to display.
 */
async function displayProductDetails(productId) {
  const productGrid = document.getElementById("product-grid");

  if (!productGrid) {
    console.error("Product grid element not found.");
    return;
  }

  try {
    const product = await fetchProductById(productId);

    if (!product) {
      productGrid.innerHTML = `<p class="text-danger">Failed to load product details. Please try again later.</p>`;
      return;
    }

    productGrid.innerHTML = `
      <div class="col-12">
        <div class="card h-100 shadow-sm">
          <img src="${product.image}" class="card-img-top mx-auto" alt="${
      product.title
    }" style="height: 300px; width: auto; object-fit: contain;">
          <div class="card-body">
            <h3 class="card-title">${product.title}</h3>
            <p class="card-text">${product.description}</p>
            <p class="card-text text-success fw-bold">$${product.price.toFixed(
              2
            )}</p>
            <p class="card-text">Rating: ${product.rating.rate} (${
      product.rating.count
    } reviews)</p>
            <button class="btn btn-primary w-100 add-to-cart-btn" data-product-id="${
              product.id
            }">Add to Cart</button>
          </div>
        </div>
        <button class="btn btn-secondary mt-2" id="back-to-products">Back to Products</button>
      </div>
    `;

    // Add event listener for the "Back to Products" button
    document
      .getElementById("back-to-products")
      .addEventListener("click", async () => {
        showSpinner();
        await displayProducts();
        hideSpinner();
      });

    // Add to cart functionality
    document.querySelector(".add-to-cart-btn").addEventListener("click", () => {
      addToCart(product.id);
    });
  } catch (error) {
    console.error("Error displaying product details:", error);
    productGrid.innerHTML = `<p class="text-danger">Failed to load product details. Please try again later.</p>`;
  }
}

// Initialize the app
document.addEventListener("DOMContentLoaded", async () => {
  showSpinner();
  await displayCategories(); // Fetch and display categories
  await displayProducts(); // Fetch and display all products initially
  hideSpinner();
});

/**
 * Save the cart to localStorage.
 * @param {Array} cart - The cart items to save.
 */
function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

/**
 * Add an item to the cart and update the badge.
 * @param {number} productId - The ID of the product to add.
 */
function addToCart(productId) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  updateCartBadge();
  alert("Item added to cart!");
}

/**
 * Update the cart badge with the number of items.
 */
