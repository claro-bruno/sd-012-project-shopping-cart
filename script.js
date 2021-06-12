const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const API_LINK = 'https://api.mercadolibre.com/items/';
const productsSection = document.querySelector('.items');
const cartList = document.querySelector('.cart__items');
const priceTag = document.getElementById('priceTag');

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

function saveCartList() {
  localStorage.setItem('shopList', cartList.innerHTML);
  localStorage.setItem('prices', priceTag.innerHTML);
}

// Function totalPrices feita com ajuda na sala de estudos
function totalPrices() {
  const listItems = document.querySelectorAll('.cart__item');
  let sumOfPrices = 0;

  listItems.forEach((item) => {
    const valor = item.innerText;
    const posicaoInicial = valor.indexOf('$') + 1;
    const posicaoFinal = valor.length;
    const stringTratada = valor.substr(posicaoInicial, posicaoFinal);
    const numero = parseFloat(stringTratada);
    sumOfPrices += numero;
  });
  priceTag.innerText = sumOfPrices;  
}

function cartItemClickListener(event) {
  event.target.remove();
  totalPrices();
  saveCartList();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function recoverSavedList() {
  cartList.innerHTML = localStorage.getItem('shopList');
  const listItems = document.querySelectorAll('.cart__item');  
  listItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  priceTag.innerHTML = localStorage.getItem('prices');
}

async function addToCart(event) {
  const mainNode = event.target.parentNode;
  const productToAdd = mainNode.firstChild.innerText;
  
  try {
    const response = await fetch(`${API_LINK}${productToAdd}`);
    const result = await response.json();
    cartList.appendChild(createCartItemElement(result))
      .addEventListener('click', cartItemClickListener);
    totalPrices();
    saveCartList();
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

function emptyCart() {
  const clearButton = document.querySelector('.empty-cart');
  
  clearButton.addEventListener('click', () => {
    const nodeChilds = document.querySelectorAll('li');
    nodeChilds.forEach((item) => item.parentNode.removeChild(item));
    totalPrices();
    localStorage.clear();
  });
}

emptyCart();

const showProducts = (object) => {
  object.forEach((element) => {
    productsSection.appendChild(createProductItemElement(element));
  });
};

function loadingScreen() {
  const container = document.querySelector('.container');
  const loadingSpan = document.createElement('span');
  loadingSpan.className = 'loading';
  loadingSpan.innerHTML = 'Loading..';
  container.appendChild(loadingSpan);
}

function removeLoadingScreen() {
  const loadingSpan = document.querySelector('.loading');
  loadingSpan.parentNode.removeChild(loadingSpan);
}

async function getProducts() {
  loadingScreen();
  try {
    const response = await fetch(API_URL);
    const { results } = await response.json();
    showProducts(results);
    removeLoadingScreen();
  } catch (error) {
    return error;
  }
}

window.onload = function onload() { 
  getProducts();
  recoverSavedList();
};
