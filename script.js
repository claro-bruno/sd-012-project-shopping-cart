// const fetch = require('node-fetch');

// const { default: fetch } = require("node-fetch");

const sectionItems = document.querySelector('.items');
// const liEl = document.querySelectorAll('.cart_item');
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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

// function getSkuFromProductItem(item) {
  //   return item.querySelector('span.item__sku').innerText;
  // }
  
const getProductId = async (id) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const data = await response.json();
    return data;
    // createCartItemElement(data);
  } catch (e) {
    return e;
  }
};

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.parentElement.removeChild(event.target);  
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addToCart() {
  const btnAddCart = document.querySelectorAll('.item__add');
  btnAddCart.forEach((btn) => {
    const olEl = document.querySelector('.cart__items');
    btn.addEventListener('click', async (event) => {
      const dataId = event.target.parentElement.querySelector('.item__sku').innerText;
      const data = await getProductId(dataId);
      olEl.appendChild(createCartItemElement(data));
    });
  });
}

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

// function removeItemCart() {
//   const olEl = document.querySelector('ol');
//   olEl.addEventListener('click', (event) => {
//     olEl.removeChild(event.target);
//   });
// }

window.onload = async () => {
  try {  
    await returningObj();
    addToCart();
    cartItemClickListener();
  } catch (error) {
    console.log('Error');
  }
};
