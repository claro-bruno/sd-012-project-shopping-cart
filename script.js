const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
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
  console.log(listItems);
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
  // coloque seu código aqui
  event.target.parentNode.removeChild(event.target);
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
  const listItems = document.getElementsByTagName('li');
  for (let index = 0; index < listItems.length; index += 1) {
    listItems[index].addEventListener('click', cartItemClickListener);
  }
  priceTag.innerHTML = localStorage.getItem('prices');
}

async function addToCart(event) {
  const productToAdd = event.target.previousSibling.previousSibling.previousSibling.innerText;
  const apiLink = 'https://api.mercadolibre.com/items/';
  try {
    const response = await fetch(`${apiLink}${productToAdd}`);
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
    console.log(nodeChilds);
    for (let index = 0; index < nodeChilds.length; index += 1) {
      nodeChilds[index].parentNode.removeChild(nodeChilds[index]);
    }
    totalPrices();
    localStorage.clear();
  });
}

emptyCart();

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
    const loading = document.getElementById('loading');
    console.log(loading);
    loading.style.visibility = 'visible';
    const response = await fetch(API_URL);
    const { results } = await response.json();
    showProducts(results);
    loading.style.visibility = 'hidden';
  } catch (error) {
    return error;
  }
}

window.onload = function onload() { 
  getProducts();
  recoverSavedList();
};
