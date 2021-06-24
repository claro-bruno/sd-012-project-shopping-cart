const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const ID_URL_BASE = 'https://api.mercadolibre.com/items/';

const saveCart = () => {
  const items = document.querySelectorAll('.cart__item');
  if (items.length > 0) {
    const cartList = Array.from(items).reduce((acc, element) => {
      const id = element.innerText.split('|')[0].replace('SKU:', '').trim();
      const title = element.innerText.split('|')[1].replace('NAME:', '').trim();
      const price = element.innerText.split('|')[2].replace('PRICE: $', '').trim();
      const obj = { id, title, price };
      return [...acc, obj];
    }, []); 
    localStorage.setItem('cart', JSON.stringify(cartList));
  } else {
    localStorage.setItem('cart', null);
  }
};

const fetchCartId = async (link) => {
  const response = await fetch(link);
  const objJson = await response.json();
  return objJson;
};

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('.cart__items').appendChild(li);
  saveCart();
}

const loadCart = () => {
  const items = JSON.parse(localStorage.getItem('cart'));
  items.forEach((item) => createCartItemElement(item));
};

const fullyLink = (id) => {
  const REAL_URL = `${ID_URL_BASE}${id}`;
  fetchCartId(REAL_URL).then((object) => createCartItemElement(object));
};

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText, id = undefined) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  if (element === 'button') {
    e.addEventListener('click', () => {
    fullyLink(id);
    });
  }
  return e;
}

function criaFilho(section) {
  document.querySelector('.items').appendChild(section);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));

  criaFilho(section);
}

const fetchList = async (link) => {
  const response = await fetch(link);
  const objetoJson = await response.json();
  const { results } = objetoJson;
  results.forEach((item) => createProductItemElement(item));
};

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = function onload() { 
  loadCart();
  fetchList(API_URL);
};
