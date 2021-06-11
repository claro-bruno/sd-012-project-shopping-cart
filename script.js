const getCartItems = () => document.querySelector('.cart__items');

  function cartItemClickListener(event) {
  const ol = document.querySelector('ol');
  ol.removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
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

/* const updateTotalCar = (price) => {
  const totalCartValue = document.querySelector('.total-price').innerText;
  const total = Number(totalCartValue) + Number(price);
  totalCartValue.innerHTML = 'qualquer coisa';
}; */

const addPrductsCart = async (item) => {
  const idProduct = getSkuFromProductItem(item);
  const totalCartValue = document.querySelector('.total-price').innerText;
  const cart = getCartItems();
  const url = `https://api.mercadolibre.com/items/${idProduct}`;
  let result = await fetch(url);
  result = await result.json();
  const { id: sku, title: name, price: salePrice } = result;
  const total = Number(totalCartValue) + Number(salePrice);
  console.log(total);
  totalCartValue.innerText = total;
  // updateTotalCar(salePrice);
  cart.appendChild(createCartItemElement({ sku, name, salePrice }));
  if (localStorage.getItem('shoppingCart') === null) {
    localStorage.setItem('shoppingCart', JSON.stringify(cart.innerHTML));
  } else {
    localStorage.setItem('shoppingCart', JSON.stringify(cart.innerHTML));
  }
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
  parentCart.appendChild(createCustomElement('span', 'total-price', 0));
  btnClearCart.addEventListener('click', clearCart);
};

window.onload = function onload() {
  
  const cart = getCartItems(); 
  loadProducts('computador');
  createTotalPrice();
  if (localStorage.getItem('shoppingCart')) {
    cart.innerHTML = JSON.parse(localStorage.getItem('shoppingCart'));
  }
 };