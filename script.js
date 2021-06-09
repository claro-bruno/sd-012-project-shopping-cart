// const fetch = require('node-fetch');

// const { default: fetch } = require("node-fetch");

// const { default: fetch } = require("node-fetch");

// const { default: fetch } = require("node-fetch");

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

const li = document.createElement('li');

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  return li;
}

function cartItemClickListener() {
  // coloque seu código aqui
  const olEl = document.querySelector('.cart__items');
  const btnAddCart = document.querySelectorAll('.item__add');
  btnAddCart.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const dataId = event.target.parentElement.querySelector('.item__sku').innerText;
      // console.log(dataId);
      const data = await getProductId(dataId);
      olEl.appendChild(createCartItemElement(data));
    });
  });
}

li.addEventListener('click', cartItemClickListener);

const sectionItems = document.querySelector('.items');
const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

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
    cartItemClickListener();
  } catch (error) {
    console.log('Error');
  }
};
