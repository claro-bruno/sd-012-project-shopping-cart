let totalcart = 0;
let arrCart = [];

const updateTotalCar = (price, add = true) => {
  const ptotal = document.querySelector('.total-price p');
  if (!add) totalcart -= price;
  else totalcart += price;
  ptotal.innerText = (Math.round(totalcart * 100) / 100);
}; 

const updateLocalStorageCart = (dataProduct, add = true) => {
  const { sku, name, salePrice } = dataProduct;
  if (!localStorage.getItem('shoppingCart')) {
    arrCart.push({ sku, name, salePrice });
    localStorage.setItem('shoppingCart', JSON.stringify(arrCart));
    // localStorage.setItem('shoppingCart', JSON.stringify(cart.innerHTML));
  } else {
    arrCart = JSON.parse(localStorage.getItem('shoppingCart'));
     
    if (!add) arrCart = arrCart.filter(({ sku: id }) => id !== sku);
    else arrCart.push({ sku, name, salePrice });
    // localStorage.setItem('shoppingCart', JSON.stringify(cart.innerHTML));
    localStorage.setItem('shoppingCart', JSON.stringify(arrCart));
  }
};

const getCartItems = () => document.querySelector('.cart__items');

function cartItemClickListener(event, data) {
  const { salePrice } = data; 
  const ol = document.querySelector('ol');
  updateTotalCar(salePrice, false);
  updateLocalStorageCart(data, false);
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event, { sku, name, salePrice }));
  return li;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img; 
}

 function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addPrductsCart = async (item) => {
  const idProduct = getSkuFromProductItem(item);
  const cart = getCartItems();
  const url = `https://api.mercadolibre.com/items/${idProduct}`;
  let result = await fetch(url);
  result = await result.json();
  const { id: sku, title: name, price: salePrice } = result;
  cart.appendChild(createCartItemElement({ sku, name, salePrice }));
  updateTotalCar(salePrice, true);
  updateLocalStorageCart({ sku, name, salePrice }, true);
}; 

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const btnAdd = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  btnAdd.addEventListener('click', () => addPrductsCart(section));
  section.appendChild(btnAdd);

  return section;
}

const loadProducts = async (filter) => {
  const loading = document.createElement('p');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  document.querySelector('.items').appendChild(loading);

  const section = document.querySelector('.items');
  section.appendChild(loading);
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${filter}`;
  let resultRequest = await fetch(url);
  if (resultRequest.ok) {
    resultRequest = await resultRequest.json();
    section.removeChild(loading);
    const resultProducts = await resultRequest.results;
    await resultProducts.forEach(({ id: sku, title: name, thumbnail: image }) => {
       section.appendChild(createProductItemElement({ sku, name, image }));
    });
  }
};

const clearCart = () => {
  const cart = getCartItems(); 
  cart.innerHTML = '';
  if (localStorage.getItem('shoppingCart')) {
    localStorage.removeItem('shoppingCart');
  }
};

const createTotalPrice = () => {
  const parentCart = document.querySelector('.cart');
  const btnClearCart = document.querySelector('.empty-cart');
  parentCart.appendChild(createCustomElement('span', 'total-price', ''));
  const totalPrice = document.querySelector('.total-price');
  totalPrice.appendChild(createCustomElement('p', '', totalcart));
  btnClearCart.addEventListener('click', clearCart);
};

window.onload = function onload() {
  const cart = getCartItems(); 
  loadProducts('computador');
  createTotalPrice();
  if (localStorage.getItem('shoppingCart')) {
    const dataCart = JSON.parse(localStorage.getItem('shoppingCart')); 
    dataCart.forEach(({ sku, name, salePrice }) => {
      cart.appendChild(createCartItemElement({ sku, name, salePrice }));
      updateTotalCar(salePrice, true);
    });
    // cart.innerHTML = JSON.parse(localStorage.getItem('shoppingCart'));
  }
 };