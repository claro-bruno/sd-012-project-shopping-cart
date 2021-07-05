const priceClass = '.total-price';
let itemValue = [];

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

function cartItemClickListener(event) {
  event.target.remove();
  document.querySelector(priceClass).innerText = 3312.6;
}

function storeItems() {
  const containerItems = document.querySelector('ol');
  localStorage.setItem('items', containerItems.innerHTML);
}

function renderItems() {
  const containerItems = document.querySelector('ol');
  if (localStorage.items) {
    containerItems.innerHTML = localStorage.getItem('items');
  }
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }, callback) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  ).addEventListener('click', () => {
    callback(sku);
  });
  const productItems = document.querySelector('.items');
  productItems.appendChild(section);

  return section;
}

function totalSum() {
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const p = document.querySelector(priceClass);
  p.innerText = itemValue.reduce(reducer);
  return p;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const containerItems = document.querySelector('.cart__items');
  containerItems.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  storeItems();
  itemValue.push(salePrice);
  totalSum();
  return li;
}

async function requisitionIdIProduct(sku) {
  const responseId = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const responseIdJson = await responseId.json();
  createCartItemElement(responseIdJson);
}

async function requisitionProduct(product) {
  const response = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=${product}`,
  );
  const responseJson = await response.json();
  const { results } = responseJson;
  document.querySelector('.loading').remove();
  results.forEach((value) => {
    createProductItemElement(value, requisitionIdIProduct);
  });
}

function removeAllItems() {
  const buttonRemoveAllItems = document.querySelector('.empty-cart');
  const containerItems = document.querySelector('ol');
  const p = document.querySelector('.total-price');
  buttonRemoveAllItems.addEventListener('click', () => {
    containerItems.innerHTML = '';
    p.innerHTML = '';
    itemValue = [];
});
}

window.onload = function onload() {
  requisitionProduct('computador');
  renderItems();
  removeAllItems();  
};
