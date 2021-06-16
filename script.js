const cartItensClass = '.cart__items';
const localStorageValues = Object.values(localStorage);

function getItensList() {
  return new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((arr) => resolve(arr.results));
  });
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
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

window.onload = function onload() {
 getItensList()
  .then((itensInfo) => itensInfo.forEach((itemInfo) => {
    const newItemElement = createProductItemElement(itemInfo);
    addCartItemClickListener(newItemElement);
    return insertItens(newItemElement);
  }));
  localStorageValues.map((value) => {
    const cartItemElement = renewCartItemElement(value);
    return document.querySelector(cartItensClass).appendChild(cartItemElement);
  });
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
