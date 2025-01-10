function showSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "flex";
}

function hideSpinner() {
  const spinner = document.getElementById("loading-spinner");
  if (spinner) spinner.style.display = "none";
}

// Fetch and display products from the Fake Store API
async function fetchAndDisplayProducts() {
  const productGrid = document.getElementById("product-grid");

  if (!productGrid) {
    console.error("Product grid element not found.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/products");
    const products = await response.json();

    productGrid.innerHTML = products
      .map((product) => createProductCard(product))
      .join("");
  } catch (error) {
    console.error("Error fetching products:", error);
    productGrid.innerHTML = `<p class="text-danger">Failed to load products.</p>`;
  }
}

// Create a single product card
function createProductCard(product) {
  return `
      <div class="col-md-4">
        <div class="card product-card">
          <img src="${product.image}" class="card-img-top" alt="${product.title}">
          <div class="card-body">
            <h5 class="card-title">${product.title}</h5>
            <p class="card-text text-success fw-bold">$${product.price}</p>
            <div class="btn-group">
              <button class="btn btn-primary" onclick="viewProductDetails(${product.id})">View</button>
              <button class="btn btn-warning" onclick="editProduct(${product.id})">Edit</button>
              <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
            </div>
          </div>
        </div>
      </div>`;
}

// View product details (Read)
async function viewProductDetails(productId) {
  try {
    showSpinner();
    const response = await fetch(`http://localhost:3000/products/${productId}`);
    const product = await response.json();
    hideSpinner();

    const modalContent = `
        <h5>${product.title}</h5>
        <p>${product.description}</p>
        <p><strong>Price:</strong> $${product.price}</p>
        <p><strong>Category:</strong> ${product.category}</p>
      `;
    document.getElementById("product-details-content").innerHTML = modalContent;

    // Show the modal
    const productDetailsModal = new bootstrap.Modal(
      document.getElementById("productDetailsModal")
    );
    productDetailsModal.show();
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

// Edit product details (Update)
let currentProductId = null; // Track the product being edited

// Edit product details (Update)
async function editProduct(productId) {
  currentProductId = productId; // Store the ID of the product being edited

  try {
    showSpinner();
    const response = await fetch(`http://localhost:3000/products/${productId}`);
    const product = await response.json();
    hideSpinner();

    // Populate the form with the product's current details
    document.getElementById("edit-title").value = product.title;
    document.getElementById("edit-description").value = product.description;
    document.getElementById("edit-price").value = product.price;
    document.getElementById("edit-image").value = product.image;
    document.getElementById("edit-category").value = product.category;

    // Show the modal
    const editProductModal = new bootstrap.Modal(
      document.getElementById("editProductModal")
    );
    editProductModal.show();
  } catch (error) {
    console.error("Error fetching product details for editing:", error);
    alert("Failed to load product details. Please try again.");
  }
}

// Handle the form submission for updating a product
document
  .getElementById("edit-product-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedProduct = {
      title: document.getElementById("edit-title").value,
      description: document.getElementById("edit-description").value,
      price: parseFloat(document.getElementById("edit-price").value),
      image: document.getElementById("edit-image").value,
      category: document.getElementById("edit-category").value,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/products/${currentProductId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(updatedProduct),
        }
      );

      if (response.ok) {
        alert("Product updated successfully!");
        const editProductModal = bootstrap.Modal.getInstance(
          document.getElementById("editProductModal")
        );
        editProductModal.hide();
        showSpinner(); // Hide the modal
        await fetchAndDisplayProducts(); // Refresh the product list
        hideSpinner();
      } else {
        alert("Failed to update product. Please try again.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  });

// Delete a product
async function deleteProduct(productId) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    const response = await fetch(
      `http://localhost:3000/products/${productId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.ok) {
      alert("Product deleted successfully!");
      fetchAndDisplayProducts(); // Refresh the product list
    } else {
      alert("Failed to delete product.");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
  showSpinner();
  await fetchAndDisplayProducts();
  hideSpinner();
});
