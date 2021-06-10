// const fetch = require('node-fetch');

// const { default: fetch } = require("node-fetch");

// const { default: fetch } = require("node-fetch");

// const cartItems = '.cart__items';
const sectionItems = document.querySelector('.items');
const loadingScreen = document.querySelector('.loading');
const body = document.querySelector('body');
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const loadingPage = () => {
  body.removeChild(loadingScreen);
};

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

// function setLocalStorage() {
//   // if (localStorage.length !== 0) localStorage.clear();
//   localStorage.setItem('cartProduct', document.querySelector(cartItems).innerHTML);
// }

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
  // setLocalStorage();
}

// const getLocalStorage = async () => {
//   const cartEl = document.querySelector(cartItems);

// }

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
      
      // setLocalStorage();
    });
  });
}

const removeAll = () => {
  const cardOl = document.querySelector('.cart__items');
  const clearBtn = document.querySelector('.empty-cart');
  clearBtn.addEventListener('click', () => {
    cardOl.innerHTML = '';
  });
};

removeAll();

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
    // console.log(objResolve)
    objResolve.forEach((element) => sectionItems.appendChild(createProductItemElement(element)));
  } catch (error) {
    console.log('Error');
  }
};

window.onload = async () => {
  try {  
    await returningObj();
    addToCart();
    loadingPage();
    // addProduct();
    cartItemClickListener();
    // await getLocalStorage();
  } catch (error) {
    console.log('Error');
  }
};
