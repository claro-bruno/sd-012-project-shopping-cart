const apiLink = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cart = document.querySelector('.cart__items');
let totalPrice = 0;
const totalPriceDisplay = document.querySelector('.total-price');

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

const cartPrice = (itemPrice, operator) => {
  totalPrice = parseInt(localStorage.getItem('totalPrice'), 10);
  if (operator === true) {
    totalPrice += itemPrice;
  } else {
    totalPrice -= itemPrice;
  }
  if (itemPrice === 0) totalPrice = 0; 
  localStorage.setItem('totalPrice', totalPrice);
  return totalPrice;
};

const updatePrice = () => {
  totalPriceDisplay.innerText = localStorage.getItem('totalPrice');
};

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.setItem('cartItems', cart.innerHTML);
  const price = parseInt(event.target.attributes.value.value, 10);
  setTimeout(() => {
    cartPrice(price, false);
  }, 0);
  setTimeout(() => {
    updatePrice();
  }, 0);
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
  li.value = `${salePrice}`;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener); (bugged for some reason)
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
    .then((data) => data.results.forEach((item) => fillPage(createProductItemElement(item))));
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
      setTimeout(() => {
        cartPrice(data.price, true);
      }, 0);
      setTimeout(() => {
        updatePrice();
      }, 0);
    });
};

const addItemInCart = () => {
  document.addEventListener('click', (item) => {
    if (item.target.className === 'item__add') {
      const id = getSkuFromProductItem(item.target.parentElement)
      fetchItem(id);
    }
  });
};

const loadCart = () => {
  // localStorage.cartItems = '';
  // localStorage.totalPrice = 0;
  const savedList = localStorage.cartItems;
  cart.innerHTML = savedList;
};

const emptyCart = () => {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    setTimeout(() => {
      cartPrice(0, true);
    }, 0);
    setTimeout(() => {
      updatePrice();
    }, 0);
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
  updatePrice();
};