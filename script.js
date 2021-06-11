const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const sectionItems = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const emptyCart = document.querySelector('.empty-cart');
const loading = document.querySelector('.loading');

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// remove item clicado carrinho.
function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
      event.target.remove();
  }
}

const loadingStr = () => {
  loading.remove();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// fetch inicial para trazer o API do mercado livre
const getApi = async () => {
  const promiseApi = await fetch(url);
  const waitLoad = await loadingStr();
  const response = await promiseApi.json();
  response.results.forEach((item) => {
    sectionItems.appendChild(createProductItemElement(item));
  });
};

// Traz o id pego pelo evento e o pesquisa no fetch.
const getApiId = async (id) => {
  const promiseId = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const response = await promiseId.json();
  cartItems.appendChild(createCartItemElement(response));
};

// evento de clique no qual é checado se o target tem certa classe, se sim o target é levado para funcao getSku e é chamado o getApiId.
const evtBtn = () => {
  sectionItems.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const id = getSkuFromProductItem(event.target.parentElement);
     getApiId(id);
    }
  });
};

// dá set = "" se o elemento pai tem filhos
const clearCart = () => {
  emptyCart.addEventListener('click', () => {
    if (cartItems.firstChild) {
      cartItems.innerHTML = '';
    }
   });
};

window.onload = function onload() {
  getApi();
  evtBtn();
  clearCart();
 };