const apiLink = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cart = document.querySelector('.cart__items');
let totalPrice = 0;
const totalPriceDisplay = document.querySelector('.total-price');
// const loading = document.getElementsByClassName('loading');

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
  cartPrice(price, false);
  updatePrice();
}

const createLoading = () => {
  const divLoad = document.createElement('div');
  divLoad.className = 'loading';
  divLoad.innerText = 'loading...';
  const place = document.querySelector('.container');
  place.appendChild(divLoad);
};

const removeLoading = () => {
  const loadingContainer = document.getElementsByClassName('loading');
  loadingContainer[0].remove();
};

const rmvClickedItem = () => {
  document.addEventListener('click', (item) => {
    if (item.target.className === 'cart__item') {
      createLoading();
      cartItemClickListener(item);
      removeLoading();
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
  createLoading();
  const list = {
    method: 'GET',
    headers: { Accept: 'application/json' },
  };

  return new Promise((resolve, reject) => {
    fetch(apiLink, list)
    .then((response) => response.json())
    .then((data) => resolve(data.results.forEach((i) => fillPage(createProductItemElement(i)))))
    .then(() => {
      removeLoading();
    })
    .catch((error) => reject(error));
  }); 
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
      cartPrice(data.price, true);
      updatePrice();
    });
};

const addItemInCart = () => {
  document.addEventListener('click', (item) => {
    if (item.target.className === 'item__add') {
      const id = getSkuFromProductItem(item.target.parentElement);
      return new Promise((resolve, reject) => {
        createLoading();
        fetch(`https://api.mercadolibre.com/items/${id}`)
          .then((response) => response.json())
          .then((json) => {
            resolve(cart.appendChild(createCartItemElement(json)));
            cartPrice(json.price, true);
            })
          .then(() => localStorage.setItem('cartItems', cart.innerHTML))
          .then(() => updatePrice())
          .catch((error) => reject(error));
          removeLoading();
      });
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
    createLoading();
    cartPrice(0, true);
    updatePrice();
    cart.innerHTML = '';
    localStorage.setItem('cartItems', cart.innerHTML);
    removeLoading();
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