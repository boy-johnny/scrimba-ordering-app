import { menuArray } from './data.js';

// DOM Elements
const menu = document.getElementById('menu');
const orderButton = document.getElementById('order-button');
const checkoutForm = document.getElementById('checkout');
const orderSection = document.getElementById('order');
const successMessage = document.getElementById('success-message');
const totalPrice = document.getElementById('total-price');
const orderList = document.getElementById('order-list');
const cardExpiry = document.getElementById('card-expiry');

// Class
class MenuItem {
  constructor(id, name, emoji, price, ingredients) {
    this.id = id;
    this.name = name;
    this.emoji = emoji;
    this.price = price;
    this.ingredients = [...ingredients];
    this.quantity = 0;
  }
  addItem() {
    this.quantity = Math.min(this.quantity + 1, 20);
    return this;
  }
  removeItem() {
    this.quantity = Math.max(this.quantity - 1, 0);
    return this;
  }
  getTotalPrice() {
    return this.price * this.quantity;
  }
  reset() {
    this.quantity = 0;
    return this;
  }
  hasItems() {
    return this.quantity > 0;
  }
}

// Create menu items
const menuItems = menuArray.map(
  (data) =>
    new MenuItem(data.id, data.name, data.emoji, data.price, data.ingredients)
);

// 使用 Map 提升查詢效能
// TODO 為什麼使用Map提升查詢效能？
const menuItemsMap = new Map(menuItems.map((item) => [item.id, item]));

function createMenuItemElement(item) {
  // Content
  const menuItemDiv = document.createElement('div');
  menuItemDiv.className = 'menu-item';

  const emojiDiv = document.createElement('div');
  emojiDiv.className = 'menu-item-emoji';
  emojiDiv.textContent = item.emoji;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'menu-item-content';

  const nameHeading = document.createElement('h3');
  nameHeading.className = 'menu-item-name';
  nameHeading.textContent = item.name;

  const ingredientsParagraph = document.createElement('p');
  ingredientsParagraph.className = 'menu-item-ingredients';
  ingredientsParagraph.textContent = item.ingredients.join(', ');

  const priceParagraph = document.createElement('p');
  priceParagraph.className = 'menu-item-price';
  priceParagraph.textContent = `$${item.price}`;

  // Buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'menu-button-container';

  const addButton = document.createElement('button');
  addButton.className = 'menu-item-button';
  addButton.setAttribute('aria-label', 'Add to Cart Button');
  addButton.setAttribute('data-add-id', item.id);
  addButton.textContent = '+';

  const removeButton = document.createElement('button');
  removeButton.className = 'menu-item-button';
  removeButton.setAttribute('aria-label', 'Remove from Cart Button');
  removeButton.setAttribute('data-remove-id', item.id);
  removeButton.textContent = '-';

  // Assemble
  contentDiv.appendChild(nameHeading);
  contentDiv.appendChild(ingredientsParagraph);
  contentDiv.appendChild(priceParagraph);

  buttonContainer.appendChild(addButton);
  buttonContainer.appendChild(removeButton);

  menuItemDiv.appendChild(emojiDiv);
  menuItemDiv.appendChild(contentDiv);
  menuItemDiv.appendChild(buttonContainer);

  return menuItemDiv;
}

// Render
function renderMenu() {
  menuItems.forEach((item) => {
    const menuItemElement = createMenuItemElement(item);
    menu.appendChild(menuItemElement);
  });
}

// Event Listeners
document.addEventListener('click', (e) => {
  if (e.target.matches('.menu-item-button[data-add-id]')) {
    orderSection.classList.remove('hidden');
    const id = parseInt(e.target.dataset.addId);
    modifyOrder(id, 'addItem');
  } else if (e.target.matches('.menu-item-button[data-remove-id]')) {
    const id = parseInt(e.target.dataset.removeId);
    modifyOrder(id, 'removeItem');
  }
});

orderButton.addEventListener('click', () => {
  checkoutForm.classList.remove('hidden');
  orderSection.classList.add('hidden');
  menuItems.forEach((item) => {
    item.reset();
    renderOrderList();
  });
});

checkoutForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(checkoutForm);
  const name = formData.get('card-name')?.trim();

  if (!name) {
    alert('Please enter your name');
    return;
  }

  checkoutForm.classList.add('hidden');
  successMessage.textContent = `Thanks, ${name}! Your order is on its way!`;
  successMessage.classList.remove('hidden');
});

function modifyOrder(id, action) {
  const item = menuItemsMap.get(id);
  if (item && typeof item[action] === 'function') {
    item[action]();
    renderOrderList();
  } else {
    console.warn(`Invalid action: ${action} for item ${id}`);
  }
}

function renderOrderList() {
  // Clear the order list
  orderList.replaceChildren();

  menuItems.forEach((item) => {
    if (item.hasItems()) {
      const row = document.createElement('tr');
      row.classList.add('order-item');

      const nameCell = document.createElement('td');
      nameCell.textContent = item.name;

      const quantityCell = document.createElement('td');
      quantityCell.textContent = item.quantity;

      const priceCell = document.createElement('td');
      priceCell.textContent = `$${item.getTotalPrice()}`;

      row.appendChild(nameCell);
      row.appendChild(quantityCell);
      row.appendChild(priceCell);

      orderList.appendChild(row);
    }
  });

  const totalPriceValue = menuItems.reduce((sum, item) => {
    return sum + item.getTotalPrice();
  }, 0);
  totalPrice.textContent = `Total: $${totalPriceValue.toFixed(2)}`;
}

cardExpiry.addEventListener('change', (e) => {
  const value = e.target.value;
  const [year, month] = value.split('-');
  const shortYear = year.slice(-4);
  e.target.value = `${shortYear}-${month}`;
});

renderMenu();
renderOrderList();
