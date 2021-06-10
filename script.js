const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const productsSection = document.querySelector('.items');
const cartList = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addToCart(event) {
  const productToAdd = event.target.previousSibling.previousSibling.previousSibling.innerText;
  const apiLink = 'https://api.mercadolibre.com/items/';
  try {
    const response = await fetch(`${apiLink}${productToAdd}`);
    const result = await response.json();
    cartList.appendChild(createCartItemElement(result));
  } catch (error) {
    console.log(error);
  }
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
    .addEventListener('click', addToCart);

  return section;
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

const showProducts = (object) => {
  object.forEach((element) => {
    productsSection.appendChild(createProductItemElement(element));
  });
};

async function getProducts() {
  try {
    const response = await fetch(API_URL);
    const { results } = await response.json();
    console.log(results);
    showProducts(results);
  } catch (error) {
    return error;
  }
}

window.onload = function onload() { 
  getProducts();
};
