let cartItemsElement;
let totalPriceElement;
let totalPrice = 0;

function getProductsEndPoint(query) {
  return `https://api.mercadolibre.com/sites/MLB/search?q=${query}`;
}

const allComputersEndPoint = getProductsEndPoint('computador');

function getIndividualComputerEndPoint(itemId) {
  return `https://api.mercadolibre.com/items/${itemId}`;
}

function updateTotalPriceElement() {
  if (totalPriceElement) {
    totalPriceElement.innerText = parseFloat(totalPrice.toFixed(2));
  }
}

function clearLocalStorageCart() {
  const emptyCart = [];
  
  localStorage.setItem('cart', JSON.stringify(emptyCart));
}

function addEventListenerToEmptyCartButton() {
  const emptyCartButtonElement = document.querySelector('.empty-cart');

  emptyCartButtonElement.addEventListener('click', () => {
    cartItemsElement.innerHTML = '';
    totalPrice = 0;
    updateTotalPriceElement();
    clearLocalStorageCart();
  });
}

function removeItemFromLocalStorage(id) {
  let cartLocalStorage = localStorage.getItem('cart');

  if (!cartLocalStorage) {
    return;
  }
  const cart = JSON.parse(cartLocalStorage);
  const cartItemIndex = cart.findIndex((item) => item.id === id);
  totalPrice -= cart[cartItemIndex].price;
  updateTotalPriceElement();
  cart.splice(cartItemIndex, 1);
  cartLocalStorage = JSON.stringify(cart);
  localStorage.setItem('cart', cartLocalStorage);
}

function cartItemClickListener(event) {
  const cartItemEl = event.path[0];
  const cartItemsEl = event.path[1];
  const nameArray = cartItemEl.innerText.split(' ');
  const sku = nameArray[1];

  cartItemsEl.removeChild(cartItemEl);
  removeItemFromLocalStorage(sku);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItemToCart(id, title, price) {
  cartItemsElement = document.querySelector('.cart__items');

  const cartItemElement = createCartItemElement({
    sku: id,
    name: title,
    salePrice: price,
  });

  cartItemElement.addEventListener('click', cartItemClickListener);
  cartItemsElement.appendChild(cartItemElement);
}

function getCartFromLocalStorage() {
  const cartLocalStorage = localStorage.getItem('cart');

  if (!cartLocalStorage) {
    return;
  }
  const cart = JSON.parse(cartLocalStorage);
  cart.forEach(({ id, title, price }) => {
    addItemToCart(id, title, price);
    totalPrice += price;
    updateTotalPriceElement();
  });
}

function addItemToCartLocalStorage(id, title, price) {
  let cart;
  const cartLocalStorage = localStorage.getItem('cart');

  if (cartLocalStorage) {
    cart = JSON.parse(cartLocalStorage);
  } else {
    cart = [];
  }

  cart.push({ id, title, price });
  localStorage.setItem('cart', JSON.stringify(cart));
  totalPrice += price;
  updateTotalPriceElement();
}

async function fetchAPIAndAddLoading(fetchAnAPI) {
  const loadingElement = document.querySelector('.loading');
  loadingElement.innerText = 'loading...';
  const results = await fetchAnAPI();
  loadingElement.remove();
  return results;
}

async function getAllComputers() {
  const response = await fetch(allComputersEndPoint);
  const { results } = await response.json();
  return results;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addEventListenerToButtonElement(buttonElement, productItemElement) {
  buttonElement.addEventListener('click', async () => {
    const sku = getSkuFromProductItem(productItemElement);
    const computerEndPoint = getIndividualComputerEndPoint(sku);
    const response = await fetch(computerEndPoint);
    const { id, title, price } = await response.json();
    addItemToCart(id, title, price);
    addItemToCartLocalStorage(id, title, price);
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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

async function showProductItems() {
  totalPriceElement = document.querySelector('.total-price');
  const itemsElement = document.querySelector('.items');
  const computers = await fetchAPIAndAddLoading(getAllComputers);

  computers.forEach(async ({ id, title, thumbnail }) => {
    const productItemElement = createProductItemElement({
      sku: id,
      name: title,
      image: thumbnail,
    });

    const buttonElement = productItemElement.lastChild;

    addEventListenerToButtonElement(buttonElement, productItemElement);

    itemsElement.appendChild(productItemElement);
  });
}

window.onload = function onload() {
  showProductItems();
  getCartFromLocalStorage();
  addEventListenerToEmptyCartButton();
};
