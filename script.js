const API_ML = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const URL_ITEM = 'https://api.mercadolibre.com/items/';

/* function removeLoading() {
  const span = document.getElementsByClassName('loading')[0];
  span.remove();
} */
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

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
/* 
function addLoading() {
  const localSpan = document.querySelector('.container');
  const span = document.createElement('span');
  span.className = 'loading';
  span.innerText = 'loading...';
  localSpan.appendChild(span);
} */

function fetchProducts() {
  const listItens = document.querySelector('.items');
  fetch(API_ML)
    .then((response) => response.json())
    .then(({ results }) => results.forEach((infoProduct) => {
      listItens.appendChild(createProductItemElement(infoProduct));
    }));
}

/* function getSkuFromProductItem(item) {
  return (item.querySelector('span.item__sku').innerText);
} */

function addCartStorage() {
  const list = document.querySelector('ol.cart__items');
  localStorage.setItem('cart', list.innerHTML);
}
function addTotalPrice(value) {
  const element = document.querySelector('.total-price');
  element.innerText = value;
  localStorage.setItem('total', value);
}

function totalPrice() {
  const li = document.querySelectorAll('li.cart__item');
  let currentValue = 0;
  li.forEach((item) => {
    const txt = item.innerText;
    const posicaoInicial = txt.indexOf('$') + 1;
    const posicaoFinal = txt.length;
    const priceString = txt.substr(posicaoInicial, posicaoFinal);
    const price = parseFloat(priceString);
    currentValue += price;
  });
  addTotalPrice(currentValue);
}
function cartItemClickListener(event) {
  if (event.target.classList.contains('cart__item')) {
    const item = event.target;
    const list = document.querySelector('.cart__items');
    list.removeChild(item);
    addCartStorage();
    totalPrice();
  }
}
function reloadCart() {
  const listSave = localStorage.getItem('cart');
  const listCart = document.querySelector('ol.cart__items');
  listCart.innerHTML = listSave;

  const priceSave = localStorage.getItem('total');
  const price = document.querySelector('.total-price');
  price.innerHTML = priceSave;

  const li = document.querySelectorAll('.cart__item');
  li.forEach((item) => item.addEventListener('click', cartItemClickListener));
}
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const list = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  list.appendChild(li);
  addCartStorage();
  li.addEventListener('click', (event) => cartItemClickListener(event));
  totalPrice();
}

function fetchForId(id) {
  fetch(`${URL_ITEM}${id}`)
    .then((response) => response.json())
    .then((results) => createCartItemElement(results));
}

function listenEventAddToCart() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const addressId = event.target.parentElement.firstElementChild.innerText;
      fetchForId(addressId);
    }
  });
}
function clearCartEndStorange() {
  const listCart = document.querySelector('ol');
  const carts = document.querySelectorAll('.cart__item');
  carts.forEach((item) => listCart.removeChild(item));
  const price = document.querySelector('p.total-price');
  price.innerText = 0;
  localStorage.clear();
}

document.querySelector('.empty-cart').addEventListener('click', () => clearCartEndStorange());

window.onload = function onload() {
  fetchProducts();
  listenEventAddToCart();
  reloadCart();
  const span = document.getElementsByClassName('loading')[0];
  span.remove();
};