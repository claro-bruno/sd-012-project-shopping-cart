/* eslint-disable max-lines-per-function */
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

function createButton(element, className, id, innerText) {
  const e = document.createElement(element);
  e.id = id;
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
  section.appendChild(createButton('button', 'item__add', `${sku}`, 'Adicionar ao carrinho!'));

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);

  const buttonItemAdd = document.querySelectorAll('.item__add');
    buttonItemAdd.forEach((btn) => btn.addEventListener('click', createCartItemElement));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  //
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  console.log('oi');
  fetch(`https://api.mercadolibre.com/items/${this.id}`)
    .then((response) => response.json())
    .then((response) => console.log(response.price));

  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(li);

  return li;
}

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const fetchAPI = () => {
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  fetch(API_URL, myObject)
    .then((response) => response.json())
    .then((response) => response.results)
    .then((response) => response.forEach((item) => createProductItemElement(item)));
};

const addProductToCart = (sku) => {
  // sku = ??
  console.log(sku);
  // console.log('oi');
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((response) => console.log(response.price));

    
};

/* const fetchPrice = (sku) => {
  console.log('oi');
  const myObject = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  fetch(`https://api.mercadolibre.com/items/${sku}`, myObject)
    .then((response) => response.json())
    .then((response) => console.log(response.price));
}; */

window.onload = function onload() { 
  fetchAPI();
};
