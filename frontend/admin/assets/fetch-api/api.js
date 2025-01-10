// const API_BASE_URL = "https://fakestoreapi.com";
const API_BASE_URL = "http://localhost:3000";

export async function loadComponent(url, placeholderId) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load ${url}: ${response.statusText}`);
    }
    const htmlContent = await response.text();
    const placeholder = document.getElementById(placeholderId);
    if (placeholder) {
      placeholder.innerHTML = htmlContent;
    }
  } catch (error) {
    console.error(`Error loading component: ${error.message}`);
  }
}

export async function fetchCategories() {
  try {
    const response = await fetch(`${API_BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function fetchProducts(category = null) {
  const endpoint = category
    ? `${API_BASE_URL}/products/category/${category}`
    : `${API_BASE_URL}/products`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function fetchProductById(productId) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export async function fetchCartProducts(cart) {
  const promises = cart.map((item) =>
    fetch(`https://fakestoreapi.com/products/${item.id}`).then((res) =>
      res.json()
    )
  );
  return Promise.all(promises);
}
