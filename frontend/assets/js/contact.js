import { loadComponent } from "../fetch-api/api.js";
import updateCartBadge from "./updateCartBadge.js";

document.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("../components/header.html", "header-placeholder");
  await loadComponent("../components/footer.html", "footer-placeholder");
  // Initialize the cart badge on page load
  updateCartBadge();
});

// Add submit event listener
const form = document.querySelector(".contact-form");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    alert("Thank you! Your message has been sent.");
    form.reset();
  });
}
