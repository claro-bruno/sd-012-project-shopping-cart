const mlbEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$';
const itemEndpoint = 'https://api.mercadolibre.com/items/';

const itemsContainer = document.querySelector('.items');
const cartContainer = document.querySelector('.cart__items');

const totalPrice = document.querySelector('.total-price');

const btnClear = document.querySelector('.empty-cart');

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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const saveCartToStorage = () => {
  const cart = document.querySelector('.cart__items');
  localStorage.setItem('cart', cart.innerHTML);
};

const decreaseTotal = (value) => {
  const valueFloat = parseFloat(value);
  const inStorage = parseFloat(localStorage.totalPrice);
  localStorage.setItem('totalPrice', (inStorage - valueFloat));
  totalPrice.innerText = `${localStorage.getItem('totalPrice')}`;
};

function cartItemClickListener(event) {
  const itemValue = event.target.innerText.split('|')[2].split('$')[1];
  decreaseTotal(itemValue);
  event.target.remove();
  saveCartToStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const increaseTotal = (value) => {
  const valueFloat = parseFloat(value);
  const inStorage = parseFloat(localStorage.getItem('totalPrice'));
  localStorage.setItem('totalPrice', (inStorage + valueFloat));
  totalPrice.innerText = `${localStorage.getItem('totalPrice')}`;
};

const addToCart = ({ id: sku, title: name, price: salePrice }) => {
  increaseTotal(salePrice);
  const cartElement = createCartItemElement({ sku, name, salePrice });
  cartContainer.appendChild(cartElement);
  saveCartToStorage();
};

const fetchAPI = (baseUrl, query, callback) => {
  fetch(`${baseUrl}${query}`)
    .then((response) => response.json())
      .then((object) => {
        callback(object);
      });
};

function itemClickListener(event) {
  if (event.target.className === 'item__add') {
    const itemId = getSkuFromProductItem(event.target.parentNode);
    fetchAPI(itemEndpoint, itemId, addToCart);
  }
}

const addItems = (object) => {
  const { results } = object;
  itemsContainer.innerHTML = '';
  results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const element = createProductItemElement({ sku, name, image });
    element.addEventListener('click', itemClickListener);
    itemsContainer.appendChild(element);
  });
};

const reloadCart = () => {
  if (localStorage.cart !== undefined) {
    cartContainer.innerHTML = localStorage.getItem('cart');
    const cartItems = Object.values(document.getElementsByClassName('cart__item'));
    cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
  if (localStorage.totalPrice === undefined) {
    localStorage.setItem('totalPrice', '0');
  }
  totalPrice.innerText = `${localStorage.getItem('totalPrice')}`;
};

const clearCart = () => {
  cartContainer.innerHTML = '';
  localStorage.cart = '';
  localStorage.totalPrice = 0;
  totalPrice.innerText = 0;
};

const createLoading = () => {
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  itemsContainer.appendChild(loading);
};

window.onload = function onload() {
  createLoading();
  fetchAPI(mlbEndpoint, 'computador', addItems);
  reloadCart();
  btnClear.addEventListener('click', clearCart);
};
