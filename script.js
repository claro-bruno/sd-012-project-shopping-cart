function capturePrice() {
  const price = document.getElementsByClassName('total-price')[0];
  return price;
}

function captureCart() {
  const cart = document.getElementsByClassName('cart__items')[0];
  return cart;
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

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

let totalPrice = 0;

function saveCart() {
  const cartItems = captureCart().innerHTML;
  localStorage.setItem('cart', cartItems);
}

function updateTotalPrice() {
  const price = capturePrice();
  price.innerText = totalPrice;
}

function savePrice() {
  localStorage.setItem('price', totalPrice);
}

function cartItemClickListener(event) {
  event.target.remove();
  const indexPrice = event.target.innerHTML.indexOf('$');
  const Itemprice = event.target.innerText.slice(indexPrice + 1);
  totalPrice -= Itemprice;
  updateTotalPrice();
  savePrice();
  saveCart();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addItemToCart = async (event) => {
  const id = getSkuFromProductItem(event.path[1]);
  const url = `https://api.mercadolibre.com/items/${id}`;
  const res = await fetch(url);
  const computer = await res.json();

  const items = captureCart();
  const item = createCartItemElement(computer);
  items.appendChild(item);
  saveCart();

  totalPrice += computer.price;
  updateTotalPrice();
  savePrice();
};

const getItems = async () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const res = await fetch(url);
  const data = await res.json();
  const loading = document.getElementsByClassName('loading')[0];
  loading.remove();
  data.results.forEach((computer) => {
    const items = document.getElementsByClassName('items')[0];
    const item = createProductItemElement(computer);
    items.appendChild(item);
    item.addEventListener('click', addItemToCart);
  });
};

function emptyCart() {
  const ol = captureCart();
  ol.innerHTML = '';
  totalPrice = 0;
  updateTotalPrice();
  savePrice();
  saveCart();
}
    
window.onload = function onload() {
  getItems();
  const cart = localStorage.getItem('cart');
  const savedPrice = localStorage.getItem('price');
  if (cart) {
    totalPrice = Number(savedPrice);
    const ol = captureCart();
    ol.innerHTML = cart;
    for (let index = 0; index < ol.children.length; index += 1) {
      ol.children[index].addEventListener('click', cartItemClickListener);
    }
  }
  if (savedPrice) {
    const price = capturePrice();
    price.innerText = savedPrice;
  }

  const emptyButton = document.getElementsByClassName('empty-cart')[0];
  emptyButton.addEventListener('click', emptyCart); 
};
