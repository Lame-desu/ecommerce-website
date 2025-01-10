const cors = require("cors");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
// Enable CORS
app.use(cors());

// Serve static files from the current directory
// app.use(express.static("jsons"));

const PORT = 3000;

// Path to the products.json file
const productsFilePath = path.join(__dirname, "/jsons/products.json");
const categoriesFilePath = path.join(__dirname, "/jsons/categories.json");

// Middleware to parse JSON data from file
let products = [];
let categories = [];
fs.readFile(productsFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading products.json:", err);
    return;
  }
  try {
    products = JSON.parse(data);
  } catch (parseErr) {
    console.error("Error parsing JSON:", parseErr);
  }
});

fs.readFile(categoriesFilePath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading products.json:", err);
    return;
  }
  try {
    categories = JSON.parse(data);
  } catch (parseErr) {
    console.error("Error parsing JSON:", parseErr);
  }
});

app.get("/products/categories", (req, res) => {
  res.json(categories);
});
// Route to get all products
app.get("/products", (req, res) => {
  res.json(products);
});

// Route to get products by category
app.get("/products/category/:categoryName", (req, res) => {
  const { categoryName } = req.params;
  const filteredProducts = products.filter(
    (product) => product.category.toLowerCase() === categoryName.toLowerCase()
  );

  if (filteredProducts.length > 0) {
    res.json(filteredProducts);
  } else {
    res
      .status(404)
      .json({ error: `No products found in category: ${categoryName}` });
  }
});

// Route to get a product by ID
app.get("/products/:productID", (req, res) => {
  const { productID } = req.params;
  const product = products.find((prod) => prod.id === parseInt(productID, 10));

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: `Product with ID ${productID} not found` });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
