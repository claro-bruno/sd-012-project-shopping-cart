const items = document.getElementsByClassName('items');

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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // pega o id, title e thumbnail e "chama" de sku, name e image
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

function cartItemClickListener(event) {
  return event;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemsToCart(id) {
  const API2 = `https://api.mercadolibre.com/items/${id}`;
  const api = await fetch(API2);
  const apiJSON = await api.json();
  const cartItems = document.querySelector('.cart__items');
  cartItems.appendChild(createCartItemElement(apiJSON));
}

const buttonEvents = () => {
  const itemButton = document.querySelectorAll('.item__add');
  itemButton.forEach((button) => button.addEventListener('click', ({ target }) => {
    console.log(target.parentNode.firstChild.innerText);
    addItemsToCart(target.parentNode.firstChild.innerText);
  }));
};

const fetchAPI = async () => { 
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const api = await fetch(API_URL); // pega, pelo API, os produtos consultados
  const apiJSON = await api.json(); // transforma a promise em JSON
  const arrayResult = apiJSON.results; // pega só o 'results' do retorno
  await arrayResult.forEach((item) => items[0].appendChild(createProductItemElement(item)));
  buttonEvents();
};

window.onload = function onload() {
  fetchAPI();
};