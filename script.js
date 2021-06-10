const ol = document.getElementsByClassName('cart__items');

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

const sec = document.getElementsByClassName('items');
const fat = async () => {
  let objAPI = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  objAPI = await objAPI.json();
  objAPI.results.forEach((API) => sec[0].appendChild(createProductItemElement(API)));
};

const toLocalStorage = () => {
  const LocalOl = document.getElementsByClassName('cart__items');
  localStorage.setItem('item', LocalOl[0].innerHTML);
};

let sum = 0;
const sumPrices = (price) => {
  const idPrice = document.getElementById('total-price');
  sum += price;
  idPrice.innerHTML = sum;
};

function cartItemClickListener({ target }) {
  target.remove();
  toLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: SalePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${SalePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(event) {
  let itemAPI = await fetch(`https://api.mercadolibre.com/items/${event}`);
  itemAPI = await itemAPI.json();
  ol[0].appendChild(createCartItemElement(itemAPI));
  sumPrices(itemAPI.price);
  toLocalStorage();
}

document.addEventListener('click', function ({ target }) {
  if (target.classList.contains('item__add')) {
    const itemID = target.parentElement.firstChild.innerText;
    addItemToCart(itemID);
  }
  if (target.classList.contains('empty-cart')) {
    ol[0].innerHTML = '';
  }
});

window.onload = function onload() {
  fat();
  ol[0].innerHTML = localStorage.getItem('item');
  ol[0].childNodes.forEach((elm) => elm.addEventListener('click', cartItemClickListener));
};