const apiLink = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const results = [];
// const cartItems = [];
const cart = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  event.target.remove();
  // const cart = document.querySelector('.cart__items');
  localStorage.setItem('cartItems', cart.innerHTML);
}

const rmvClickedItem = () => {
  document.addEventListener('click', (item) => {
    if (item.target.className === 'cart__item') {
      cartItemClickListener(item);
    }
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
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
      // const cart = document.querySelector('.cart__items');
      cart.appendChild(createCartItemElement(data));
      // cartItems.push(cart.innerHTML);
      localStorage.setItem('cartItems', cart.innerHTML);
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
  // console.log(localStorage);
  // const cartList = document.querySelector('.cart__items');
  const savedList = localStorage.cartItems;
  // console.log(savedList);
  // localStorage.cartItems = '';
  cart.innerHTML = savedList;
};

const emptyCart = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    // const cart = document.querySelector('.cart__items');
    cart.innerHTML = '';
    localStorage.setItem('cartItems', cart.innerHTML);
  });
};

window.onload = function onload() { 
  fetchAPI();
  addItemInCart();
  loadCart();
  rmvClickedItem();
  emptyCart();
};