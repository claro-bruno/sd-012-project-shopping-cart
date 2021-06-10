const ol = document.getElementsByClassName('cart__items');
const h1 = document.getElementsByClassName('loading');

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

function getprice() {
  const sPrice = document.querySelectorAll('.price');
  const idPrice = document.getElementsByClassName('total-price');
  let totalPrice = 0;
  sPrice.forEach((elm) => { totalPrice += Number(elm.innerText); });
  idPrice[0].innerText = totalPrice;
}

const sec = document.getElementsByClassName('items');
const fat = async () => {
  let objAPI = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador');
  objAPI = await objAPI.json();
  objAPI.results.forEach((API) => sec[0].appendChild(createProductItemElement(API)));
  h1[0].remove();
};

const toLocalStorage = () => {
  const LocalOl = document.getElementsByClassName('cart__items');
  localStorage.setItem('item', LocalOl[0].innerHTML);
};

function cartItemClickListener({ target }) {
  target.remove();
  toLocalStorage();
  getprice();
}

function createCartItemElement({ id: sku, title: name, price: SalesPrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${sku} | NAME: ${name} | PRICE: $<span class='price'>${SalesPrice}</span>`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItemToCart(event) {
  let itemAPI = await fetch(`https://api.mercadolibre.com/items/${event}`);
  itemAPI = await itemAPI.json();
  ol[0].appendChild(createCartItemElement(itemAPI));
  toLocalStorage();
  getprice();
}

document.addEventListener('click', function ({ target }) {
  if (target.classList.contains('item__add')) {
    const itemID = target.parentElement.firstChild.innerText;
    addItemToCart(itemID);
  }
  if (target.classList.contains('empty-cart')) {
    ol[0].innerHTML = '';
    getprice();
  }
});

window.onload = function onload() {
  fat();
  ol[0].innerHTML = localStorage.getItem('item');
  ol[0].childNodes.forEach((elm) => elm.addEventListener('click', cartItemClickListener));
  getprice();
};
