/* eslint-disable no-restricted-globals */
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

function cartItemClickListener() {
  const itemList = document.querySelector('.cart__items');
  const li = document.querySelector('.cart__item');
  itemList.removeChild(li);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const element = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  element.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = (event) => {
  const clickId = event.target.parentElement.firstElementChild.innerText;
  console.log(clickId);
  fetch(`https://api.mercadolibre.com/items/${clickId}`)
  .then((response) => response.json())
  .then((item) => {
    console.log(item);
    createCartItemElement(item);
  });
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addItemToCart);

  return section;
}

const appendItem = (products) => {
  const item = document.getElementsByClassName('items');
  products.forEach((product) => item[0].appendChild(createProductItemElement(product)));
};

const fetchAPI = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(url)
  .then((response) => response.json())
  .then(({ results }) => appendItem(results));
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = function onload() { 
  fetchAPI();
};
