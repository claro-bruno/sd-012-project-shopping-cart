const appendElement = (el, parent) => parent.appendChild(el);

function saveCartList() {
  const cartList = document.querySelectorAll('li.cart__item');
  if (cartList.length > 0) {
    const cartListTextArr = Array.from(cartList).reduce((acc, item) => {
      const id = item.innerText.split('|')[0].replace('SKU:', '').trim();
      const title = item.innerText.split('|')[1].replace('NAME:', '').trim();
      const price = item.innerText.split('|')[2].replace('PRICE: $', '').trim();
      const itemObj = {
        id,
        title,
        price,
      };
      return [...acc, itemObj];
    }, []);
    window.localStorage.setItem('cartItems', JSON.stringify(cartListTextArr));
  } else {
    window.localStorage.setItem('cartItems', null);
  }
}

function totalValue() {
  const items = JSON.parse(window.localStorage.getItem('cartItems'));
  const priceElement = document.querySelector('.total-price');
  if (items) {
    const price = items.reduce((acc, item) => (acc + parseFloat(item.price)), 0);
    priceElement.innerText = price;
  } else {
    priceElement.innerText = 0;
  } 
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  saveCartList();
  totalValue();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  
  const parent = document.querySelector('ol.cart__items');
  appendElement(li, parent);
}

function loadCartList() {
  const storage = JSON.parse(window.localStorage.getItem('cartItems'));
  if (storage) {
    storage.forEach((item) => createCartItemElement(item));
  }
  totalValue();
}

function emptyCart() {
  const btn = document.querySelector('.empty-cart');
  btn.addEventListener('click', () => {
    const cartList = document.querySelectorAll('li.cart__item');
    cartList.forEach((item) => item.parentElement.removeChild(item));
    saveCartList();
    totalValue();
  });
}

function loadingStatus() {
  const loadingElement = document.querySelector('.loading');
  const parent = document.querySelector('.cart');
  if (loadingElement) {
    loadingElement.parentElement.removeChild(loadingElement);
  } else {
    const loading = document.createElement('p');
    loading.innerHTML = 'loading...';
    loading.classList.add('loading');
    parent.appendChild(loading);
  }
}

function fetchList(url) {
  loadingStatus();
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((r) => r.json())
      .then((obj) => resolve(obj))
      .then(() => loadingStatus())
      .catch((err) => reject(err));
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

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

  const parent = document.querySelector('section.items');
  appendElement(section, parent);
}

function cartItems(e) {
  const target = e.target.parentElement;
  const url = `https://api.mercadolibre.com/items/${getSkuFromProductItem(target)}`;
  fetchList(url)
    .then((r) => createCartItemElement(r))
    .then(() => {
      saveCartList();
      totalValue();
    })
    .catch((error) => console.log(error));
  }

function cartButtonClickListener() {
  const btnList = document.querySelectorAll('.item__add');
  btnList.forEach((btn) => btn.addEventListener('click', cartItems));
}

window.onload = function onload() {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetchList(URL)
    .then((r) => r.results)
    .then((items) => items.forEach((item) => createProductItemElement(item)))
    .then(() => cartButtonClickListener())
    .then(() => loadCartList())
    .then(() => emptyCart())
    .catch((error) => console.log(error));
};