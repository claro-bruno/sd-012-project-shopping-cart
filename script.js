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

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function clearMessage(event, container) {
  container.removeChild(event.target.parentElement);
}

function message(text) {
  const container = document.querySelector('.container');
  const messageContainer = createCustomElement('div', 'message', '');
  container.appendChild(messageContainer);
  messageContainer.appendChild(createCustomElement('h2', 'message-title', 'Erro'));
  messageContainer.appendChild(createCustomElement('p', 'text-message', text));
  const btn = createCustomElement('button', 'btn-message', 'OK');
  btn.addEventListener('click', (event) => clearMessage(event));
  messageContainer.appendChild(btn);
}

function checkResponse(response) {
  if (response.ok) return response.json();
  throw new Error('Ocorreu um erro com a requisição');
}

function fetchApi(url) {
  return fetch(url)
    .then((response) => checkResponse(response))
    .catch((err) => console.log(err));
}

function removeItemStorage(item) {
  const skuRemove = item.innerText.split('|')[0].replace(/SKU:\s/g, '').trim();
  const items = localStorage.getItem('cart');
  const listItems = JSON.parse(items);
  const newList = listItems.filter(({ sku }) => sku !== skuRemove);
  localStorage.setItem('cart', JSON.stringify(newList));
}

function sumTotal() {
  const totalPrice = document.querySelector('.total-price');
  const cartItems = document.querySelectorAll('.cart__item');
  const priceItems = Array.prototype.map.call(cartItems, 
    (item) => Number(item
      .innerHTML
      .split('|')
      .reverse()[0]
      .replace(/[^\d.]+/g, '')))
    .reduce((total, price) => total + price, 0);
  totalPrice.innerText = priceItems;
}

function cartItemClickListener(event) {
  const item = event.target;
  item.parentElement.removeChild(item);
  removeItemStorage(item);
  sumTotal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addInLocalStorage(item) {
  const items = localStorage.getItem('cart') || '[]';
  const listItems = JSON.parse(items);
  listItems.push(item);
  localStorage.setItem('cart', JSON.stringify(listItems));
}

function addItemInCart(event) {
  const cartItem = document.querySelector('.cart__items');
  const id = event.target.parentNode.firstChild.innerText;
  fetchApi(`https://api.mercadolibre.com/items/${id}`)
    .then(({ id: sku, title: name, price: salePrice }) => {
      cartItem.appendChild(createCartItemElement({ sku, name, salePrice }));
      addInLocalStorage({ sku, name, salePrice });
      sumTotal();
    })
    .catch(() => message('O item adicionado não está disponível'));
}   

function addBtnEvent() {
  const btnArray = document.querySelectorAll('.item__add');
  btnArray.forEach((btn) => {
    btn.addEventListener('click', (event) => addItemInCart(event));
  });
}

function addItems(results, items) {
  const loading = items;
  loading.innerHTML = '';
  const arrayResults = results
    .map(({ id: sku, title: name, thumbnail: image }) => ({ sku, name, image }));
  arrayResults.forEach((objResult) => items.appendChild(createProductItemElement(objResult)));
  addBtnEvent();
}

function createTotalPriceContainer() {
  const cart = document.querySelector('.cart');
  const totalContainer = createCustomElement('section', 'total-container', ' ');
  cart.appendChild(totalContainer);
  const text = createCustomElement('p', 'text-price', 'TOTAL R$');
  totalContainer.appendChild(text);
  const totalPrice = createCustomElement('p', 'total-price', 0);
  totalContainer.appendChild(totalPrice);
}

function loadCart(cartItems) {
  const items = localStorage.getItem('cart') || '[]';
  const listItems = JSON.parse(items); 
  listItems.forEach((item) => {
    cartItems.appendChild(createCartItemElement(item));
  });
  sumTotal();
}

function clearItems(cartItems) {
  const items = cartItems;
  items.innerHTML = '';
  localStorage.setItem('cart', '[]');
  sumTotal();
}

function addEventEmptyCart(cartItems) {
  const emptyCart = document.querySelector('.empty-cart');
  emptyCart.addEventListener('click', () => clearItems(cartItems));
}

function addLoading(items) {
  const loading = createCustomElement('p', 'loading', 'loading...');
  items.appendChild(loading);
}

window.onload = function onload() { 
  const items = document.querySelector('.items');
  const cartItems = document.querySelector('.cart__items');
  
  createTotalPriceContainer();
  loadCart(cartItems);
  addEventEmptyCart(cartItems);
  addLoading(items);

  fetchApi('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(({ results }) => addItems(results, items))
    .catch(() => message('O produto procurado não foi encontrado'));
};
