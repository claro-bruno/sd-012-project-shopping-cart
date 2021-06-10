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

function cartItemClickListener(event) {
  return event.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event.target));
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Requisito 2 - Referẽncia: Caroline Benichio.
const addProductToCart = async (idProduct) => {
  const getOlCartItems = document.querySelector('.cart__items');
  const apiURL = `https://api.mercadolibre.com/items/${idProduct}`;
  const response = await fetch(apiURL);
  const data = await response.json();
  return getOlCartItems.appendChild(createCartItemElement(data));
};

// Requisito 2 - Referẽncia: Caroline Benichio.
const addEventListenerToItemsButtons = () => {
  const getItemsButtons = document.querySelectorAll('.item__add');
  getItemsButtons.forEach((button) => 
    button.addEventListener('click', (event) =>
      addProductToCart(getSkuFromProductItem(event.target.parentNode))));
};

// Requisito 1 - Referẽncias: Natalia Souza - turma 11, Caroline Benichio. 
const addProductsToSectionItens = async () => {
  const getSectionItems = document.querySelector('.items');
  const apiURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(apiURL);
  const data = await response.json();
  const arrayResults = data.results;
  await arrayResults.forEach((product) => 
  getSectionItems.appendChild(createProductItemElement(product)));
  addEventListenerToItemsButtons();
};

window.onload = function onload() {
  addProductsToSectionItens();
};
