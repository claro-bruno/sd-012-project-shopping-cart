const cartItensClass = '.cart__items';
const localStorageValues = Object.values(localStorage);
const priceContainerClass = '.price-container';
const priceSpanClass = '.total-price';
const spanClassName = 'total-price';

function getItensList() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((arr) => resolve(arr.results));
  });
}

function calcPrice(valor) {
  let registeredPrice = document.querySelector(priceSpanClass).innerText;
  const numberPrice = parseFloat(registeredPrice);
  const numberValor = parseFloat(valor);
  const actualPrice = numberValor + numberPrice;
  registeredPrice = actualPrice;
  return registeredPrice;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function changePrice(registeredPrice) {
  const labelPrice = document.querySelector(priceSpanClass);
  document.querySelector(priceContainerClass).removeChild(labelPrice);
  const totalPrice = createCustomElement('span', spanClassName, `${registeredPrice}`);
  return document.querySelector(priceContainerClass).appendChild(totalPrice);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getItemInfo(itemID) {
  return new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((arr) => resolve(arr));
  });
}

function removeSavedItem(item) {
  const savedItem = item.target.innerText;
  const key = savedItem.split(' ')[1];
  return localStorage.removeItem(key);
}

function cartItemClickListener(event) {
  removeSavedItem(event);
  const removedItem = event.target.innerText;
  const getPrice = parseFloat(`-${removedItem.split('$')[1]}`);
  const actualPrice = calcPrice(getPrice);
  changePrice(actualPrice);
  return event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function renewCartItemElement(string) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = string;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function insertCartItem(event) {
  const eventId = event.firstElementChild.innerText;
  getItemInfo(eventId).then((itemInfo) => {
    const newCartItemElement = createCartItemElement(itemInfo);
    const stgItem = `SKU: ${itemInfo.id} | NAME: ${itemInfo.title} | PRICE: $${itemInfo.price}`;
    localStorage.setItem(itemInfo.id, stgItem);
    const actualPrice = calcPrice(parseFloat(itemInfo.price));
    changePrice(actualPrice);
    return document.querySelector(cartItensClass).appendChild(newCartItemElement);
  });
}

function addCartItemClickListener(target) {
  return target.addEventListener('click', () => insertCartItem(target));
}

function insertItens(itemElement) {
  const itensSection = document.querySelector('.items');
  return itensSection.appendChild(itemElement);
}

function createPriceCounter() {
  const priceContainer = createCustomElement('div', 'price-container', 'TOTAL PRICE: R$ ');
  const totalPrice = createCustomElement('span', spanClassName, '0');
  document.querySelector('.cart').appendChild(priceContainer);
  return document.querySelector(priceContainerClass).appendChild(totalPrice);
}

function clearCart() {
  const allCartItens = document.querySelectorAll('.cart__item');
  const cart = document.querySelector('.cart__items');
  allCartItens.forEach((cartItem) => cart.removeChild(cartItem));
  localStorage.clear();
  const labelPrice = document.querySelector(priceSpanClass);
  document.querySelector(priceContainerClass).removeChild(labelPrice);
  const totalPrice = createCustomElement('span', spanClassName, '0');
  return document.querySelector(priceContainerClass).appendChild(totalPrice);
}

function addClearButtonClickListener(target) {
  return target.addEventListener('click', () => clearCart());
}

function createClearCartButton() {
  const clearButton = document.querySelector('.empty-cart');
  return addClearButtonClickListener(clearButton);
}

window.onload = function onload() {
 getItensList()
  .then((itensInfo) => itensInfo.forEach((itemInfo) => {
    const newItemElement = createProductItemElement(itemInfo);
    addCartItemClickListener(newItemElement);
    return insertItens(newItemElement);
  }));
  createPriceCounter();
  localStorageValues.map((value) => {
    const actualPrice = calcPrice(value.split('$')[1]);
    changePrice(actualPrice);
    const cartItemElement = renewCartItemElement(value);
    return document.querySelector(cartItensClass).appendChild(cartItemElement);
  });
  createClearCartButton();
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
