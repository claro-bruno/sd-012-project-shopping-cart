const olItems = document.querySelector('.cart__items');
const buttonClear = document.querySelector('.empty-cart');
const TotalPriceSpan = document.querySelector('.total-price');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const clearCart = () => {
  olItems.innerHTML = '';
  localStorage.item = '';
  localStorage.totalPrice = 0;
  TotalPriceSpan.innerText = 0;
};

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

const inLocalStorage = () => {
  const inOl = document.getElementsByClassName('cart__items');
  localStorage.setItem('item', inOl[0].innerHTML);
};

const subtractPrice = (value) => {
  const valueFloat = parseFloat(value);
  const inStorage = parseFloat(localStorage.totalPrice);
  localStorage.setItem('totalPrice', (inStorage - valueFloat));
  const span = document.querySelector('.total-price');
  span.innerHTML = localStorage.getItem('totalPrice');
};

function cartItemClickListener(event) {
  const itemValue = event.target.innerText.split('|')[2].split('$')[1];
  subtractPrice(itemValue);
  event.target.remove();
  inLocalStorage();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const sumPrices = (price) => {
  const totalPrice = parseFloat(localStorage.getItem('totalPrice'));
  localStorage.setItem('totalPrice', (totalPrice + price));
  TotalPriceSpan.innerHTML = localStorage.getItem('totalPrice');
};

async function clickToAddItems(item, index) {
  const addItemButton = document.getElementsByClassName('item__add')[index];
  const itemID = item.id;
  addItemButton.addEventListener('click', async () => {
    const responseItem = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    const responseItemJSON = await responseItem.json();
    const liItem = createCartItemElement(responseItemJSON);
    olItems.appendChild(liItem);
    sumPrices(responseItemJSON.price);
    inLocalStorage();
  });
}

async function catchMercadoLivreApi() {
  const sectionItems = document.querySelector('.items');
  const responseList = await
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseListJSON = await responseList.json();
  const productsList = responseListJSON.results;
  productsList.forEach((item, index) => {
    const product = createProductItemElement(item);
    sectionItems.appendChild(product);
    clickToAddItems(item, index);
  });
}

const checkCart = () => {
  if (localStorage.item !== undefined) {
    olItems.innerHTML = localStorage.getItem('item');
    const cartItems = Object.values(document.getElementsByClassName('cart__item'));
    cartItems.forEach((item) => item.addEventListener('click', cartItemClickListener));
  }
  if (localStorage.totalPrice === undefined) {
    localStorage.setItem('totalPrice', 0);
  }
};

window.onload = function onload() {
  catchMercadoLivreApi();
  checkCart();
  buttonClear.addEventListener('click', clearCart);
};
