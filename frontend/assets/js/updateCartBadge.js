export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function updateCartBadge() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartBadge = document.querySelector(".cart-badge");
  if (cartBadge) {
    cartBadge.textContent = totalItems;
  } else {
    console.log("there is no cart badge");
  }
}

export default updateCartBadge;
