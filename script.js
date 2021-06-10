const shopPrice = 'shopPrice';
const shopCart = 'shopCart';
const BASE_URL = 'https://api.mercadolibre.com/';
const body = document.querySelector('body');
const listaCarrinho = document.querySelector('ol');
const totalPrice = document.querySelector('.total-price');

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function removingTotalToStorage(li) {
  const valor = li.innerText.split('$')[1];
  let somaProdutos;
  somaProdutos = Number(localStorage.getItem(shopPrice));
  somaProdutos -= Number(valor);
  localStorage.setItem(shopPrice, somaProdutos);
  totalPrice.innerText = localStorage.getItem(shopPrice);
}

function cartItemClickListener(event) {
  removingTotalToStorage(event.target);
  listaCarrinho.removeChild(event.target);
  localStorage.setItem(shopCart, listaCarrinho.innerHTML);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addingTotalToStorage(product) {
  if (!product) {
    totalPrice.innerText = localStorage.getItem(shopPrice);
    return;
  }
  let somaProdutos;
  if (!localStorage.getItem(shopPrice)) somaProdutos = 0;
  else somaProdutos = Number(localStorage.getItem(shopPrice));
  somaProdutos += Number(product.price);
  localStorage.setItem(shopPrice, somaProdutos);
  totalPrice.innerText = localStorage.getItem(shopPrice);
}

function addingLoading() {
  const loading = document.createElement('h1');
  loading.classList.add('loading');
  loading.innerText = 'loading...';
  body.appendChild(loading);
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  body.removeChild(loading);
}

function fetchingItemToCart(product) {
  const produto = createCartItemElement(product);
  listaCarrinho.appendChild(produto);
  localStorage.setItem(shopCart, listaCarrinho.innerHTML);
  addingTotalToStorage(product); 
}

function itemClickListener() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => {
    const button = item.querySelector('button');
    const id = getSkuFromProductItem(item);
    button.addEventListener('click', () => {
      addingLoading();
      fetch(`${BASE_URL}items/${id}`)
      .then((response) => response.json())
      .then((product) => {
        fetchingItemToCart(product);
        removeLoading();
      });
    });
  });
}

async function fetchingProducts() {
  try {
  const response = await fetch(`${BASE_URL}sites/MLB/search?q=computador`);
  const { results } = await response.json();
  results.forEach((product) => {
    const items = document.querySelector('.items');
    const newItem = createProductItemElement(product);
    items.appendChild(newItem);
  });
  removeLoading();
  itemClickListener();
  } catch (error) {
    alert('Deu erro');
  }
}

function clearingCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    listaCarrinho.innerHTML = '';
    localStorage.setItem(shopCart, listaCarrinho.innerHTML);
    localStorage.setItem(shopPrice, 0);
    totalPrice.innerText = localStorage.getItem(shopPrice);
  });
}

function loadingLocalStorage() {
  listaCarrinho.innerHTML = localStorage.getItem(shopCart);
  const li = listaCarrinho.querySelectorAll('li');
  li.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
}

window.onload = function onload() { 
  loadingLocalStorage();
  fetchingProducts();
  addingTotalToStorage();
  clearingCart();
};