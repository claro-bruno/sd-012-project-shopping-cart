const urlML = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const produtosStorage = 'lista-produtos';
const cartItemsString = 'ol.cart__items';

function storageSave() {
  const cartItems = document.querySelector(cartItemsString);
  localStorage.setItem(`${produtosStorage}`, cartItems.innerHTML);
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const img = image.replace(/-I.jpg/, '-O.jpg');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  const target = item.target.parentNode;
  return target.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  storageSave();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function requestAppendAPI() {
  const fetchedAPI = await fetch(urlML);
  const jsonAPI = await fetchedAPI.json();
  const jsonResults = await jsonAPI.results;
  const itemsList = document.querySelector('section.items');
  itemsList.firstChild.remove();
  jsonResults.forEach((item) => {
    itemsList.appendChild(createProductItemElement(item));
  });
}

async function addToCart(evt) {
  const cartItems = document.querySelector(cartItemsString);

  const id = getSkuFromProductItem(evt);
  const fetchProduct = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const productJson = await fetchProduct.json();
  cartItems.appendChild(createCartItemElement(productJson));
  storageSave();
}

function buttonsEvent() {
  const allButtons = document.querySelectorAll('button.item__add');

  allButtons.forEach((button) => {
    button.addEventListener('click', (evt) => {
      addToCart(evt);
    });
  });
}

function getStorage() {
  const cartItems = document.querySelector(cartItemsString);
  cartItems.innerHTML = localStorage.getItem(`${produtosStorage}`);
  const listItems = document.querySelectorAll('li.cart__item');

  listItems.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
}

function emptyCartButton() {
  const emptyCart = document.querySelector('button.empty-cart');
  const cartItems = document.querySelector(cartItemsString);

  emptyCart.addEventListener('click', () => {
    cartItems.innerHTML = '';
    localStorage.clear();
  });
}

window.onload = async () => {
  await requestAppendAPI();
  buttonsEvent();
  getStorage();
  emptyCartButton();
};
