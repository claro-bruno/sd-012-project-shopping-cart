const apiLink = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const results = [];
// const cartItems = [];
const cart = document.querySelector('.cart__items');
let everyPrice = [];
let totalPrice;
const totalPriceSpan = document.querySelector('.total-price');

// let itemClicked = {};

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
  const img = image.replace(/-I.jpg/g, '-E.jpg');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.setItem('cartItems', cart.innerHTML);
}

const rmvClickedItem = () => {
  document.addEventListener('click', (item) => {
    if (item.target.className === 'cart__item') {
      cartItemClickListener(item);
      const valor = item.target.value;
      const index = everyPrice.indexOf(valor);
      everyPrice.splice(index, 1);
      localStorage.setItem('everyPrice', everyPrice);
      if (everyPrice.length > 0) {
        totalPrice = everyPrice.reduce((accumluator, current) => accumluator + current);
        localStorage.setItem('totalPrice', totalPrice);
      } else {
        totalPrice = 0;
        localStorage.setItem('totalPrice', totalPrice);
      }
      totalPriceSpan.innerText = `${totalPrice}`;
    }
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item'; // `cart__item ${salePrice}`
  li.value = `${salePrice}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const fillPage = (item) => {
  const items = document.querySelector('.items');
  items.appendChild(item);
};

const fetchAPI = () => {
  const list = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  return fetch(apiLink, list)
    .then((response) => response.json())
    .then((data) => data.results.map((item) => {
      results.push(item);
      return fillPage(createProductItemElement(item));
    }));
};

const fetchItem = (id) => {
  const link = `https://api.mercadolibre.com/items/${id}`;
  const list = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };
  
  return fetch(link, list)
    .then((response) => response.json())
    .then((data) => {
      cart.appendChild(createCartItemElement(data));
      localStorage.setItem('cartItems', cart.innerHTML);
      everyPrice.push(data.price);
      totalPrice = everyPrice.reduce((accumluator, current) => accumluator + current);
      totalPriceSpan.innerText = `${totalPrice}`;
      localStorage.setItem('totalPrice', totalPrice);
      localStorage.setItem('everyPrice', everyPrice);
    });
};

const addItemInCart = () => {
  document.addEventListener('click', (item) => {
    if (item.target.className === 'item__add') {
      const parent = item.target.parentElement;
      const id = parent.querySelector('.item__sku').innerText;
      results.find((encontra) => encontra.id === id);
      fetchItem(id);
    }
  });
};

const loadCart = () => {
  // localStorage.cartItems = '';
  // localStorage.totalPrice = 0;
  const savedList = localStorage.cartItems;
  cart.innerHTML = savedList;

  const savedPrice = localStorage.totalPrice;
  totalPriceSpan.innerText = `${savedPrice}`;
  everyPrice.push(parseInt(savedPrice, 10));
};

const emptyCart = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    cart.innerHTML = '';
    localStorage.setItem('cartItems', cart.innerHTML);
    localStorage.setItem('totalPrice', 0);
    everyPrice = [];
    localStorage.setItem('everyPrice', '');
    const savedPrice = localStorage.totalPrice;
    totalPriceSpan.innerText = `${savedPrice}`;
  });
};

window.onload = function onload() { 
  fetchAPI();
  addItemInCart();
  loadCart();
  rmvClickedItem();
  emptyCart();
};