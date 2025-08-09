<div align="center">
    <h1 style="color:purple">
    Scrimba
    <br/> 
    <span style="color:black">Mobile Ordering App</span>
    </h1>
    <br/>
    <img src="assets/scrimba.png" alt="scrimba cover image" width="100%" style="border-radius:20px">
</div>

## Introduction

This is a simple ordering app which allows customers to place orders for items.

## Preview

<div align="center">
    <img src="assets/preview.gif" alt="the demo process from ordering food to completion" height="800px" style="border-radius:12px">
</div>

## Features

1. Rendering the menu item
2. Add or remove quantity
3. Show the order list
4. Fill in card information

## Learning point

### Classes

1. Use classes to construct the menu items
2. Iterate the menu item from `data.js`

```js
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

const menuItemsMap = new Map(menuItems.map((item) => [item.id, item]));
```

### createElement

Use `createElement`, `className`, `appendChild` to replace `innerHTML` for security

### Dataset

Recoginize the add and remove item button through the custom classes

```js
const addButton = document.createElement("button");
addButton.className = "menu-item-button";
addButton.setAttribute("aria-label", "Add to Cart Button");
addButton.setAttribute("data-add-id", item.id);
addButton.textContent = "+";

const removeButton = document.createElement("button");
removeButton.className = "menu-item-button";
removeButton.setAttribute("aria-label", "Remove from Cart Button");
removeButton.setAttribute("data-remove-id", item.id);
removeButton.textContent = "-";
```

```js
document.addEventListener("click", (e) => {
  if (e.target.matches(".menu-item-button[data-add-id]")) {
    orderSection.classList.remove("hidden");
    const id = parseInt(e.target.dataset.addId);
    modifyOrder(id, "addItem");
  } else if (e.target.matches(".menu-item-button[data-remove-id]")) {
    const id = parseInt(e.target.dataset.removeId);
    modifyOrder(id, "removeItem");
  }
});
```

### formData

Get the form data to render

```js
const formData = new FormData(checkoutForm);
const name = formData.get("card-name")?.trim();
```

### Custom date input

Expiry dates only contain year and month, so I modify the formate of date input

```js
cardExpiry.addEventListener("change", (e) => {
  const value = e.target.value;
  const [year, month] = value.split("-");
  const shortYear = year.slice(-4);
  e.target.value = `${shortYear}-${month}`;
});
```

## How to use

1. **Clone this repository**: `git clone git@github.com:boy-johnny/scrimba-ordering-app.git`
2. **Open the index.html**

## Contribution

Thanks to **[Scrimba](https://scrimba.com)** for their concept and Figma design file
