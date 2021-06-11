// const fetch = require('node-fetch');

// const { default: fetch } = require("node-fetch");

// const { default: fetch } = require("node-fetch");

// const cartItems = document.querySelector('.cart__items');
// const liEl = document.querySelectorAll('.cart__item');
const sectionItems = document.querySelector('.items');
const loadingScreen = document.querySelector('.loading');
const body = document.querySelector('body');
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cartList = '.cart__items';

const loadingPage = () => {
  body.removeChild(loadingScreen);
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartProducts() {
  const cartFull = document.querySelector('.empty-cart').nextElementSibling;
  const items = cartFull.children;
  localStorage.clear();
  let num = 0;
  Object.values(items).forEach((item) => {
    localStorage.setItem(num, item.innerText);
    num += 1;
  });
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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }
  
const getProductId = async (id) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const data = await response.json();
    return data;
  } catch (e) {
    return e;
  }
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.parentElement.removeChild(event.target);
  localStorage.removeItem(event.target.id);
  cartProducts();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart() {
  const btnAddCart = document.querySelectorAll('.item__add');
  btnAddCart.forEach((btn) => {
    const olEl = document.querySelector('.cart__items');
    btn.addEventListener('click', async (event) => {
      const dataId = event.target.parentElement.querySelector('.item__sku').innerText;
      const data = await getProductId(dataId);
      olEl.appendChild(createCartItemElement(data));
      cartProducts();
    });
  });
}

const removeAll = () => {
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    document.querySelector(cartList).innerHTML = '';
    localStorage.clear();
  });
};

removeAll();

function initCart() {
  for (let index = 0; index < localStorage.length; index += 1) {
    const li = createCartItemElement({ sku: null, name: null, salePrice: null });
    li.innerText = localStorage.getItem(index);
    document.querySelector(cartList).appendChild(li);
  }
}

initCart();

const verifyFetch = async () => {
  const fetchingApi = fetch(API_URL)
  .then((response) => response
  .json()
    .then((data) => data));
  return fetchingApi;    
};

const returningObj = async () => {
  try {
    const obj = await verifyFetch();
    const objResolve = obj.results;
    objResolve.forEach((element) => sectionItems.appendChild(createProductItemElement(element)));
  } catch (error) {
    console.log('Error');
  }
};

window.onload = async () => {
  try {  
    await returningObj();
    await addToCart();
    loadingPage();
    cartItemClickListener();
  } catch (error) {
    console.log(error);
  }
};
