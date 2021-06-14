const urlML = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const produtosStorage = 'lista-produtos';

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
  const img = image.replace(/-I.jpg/, '-O.jpg');
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  const target = item.target.parentNode;
  return target.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function requestAppendAPI() {
  const fetchedAPI = await fetch(urlML);
  const jsonAPI = await fetchedAPI.json();
  const jsonResults = await jsonAPI.results;
  const itemsList = document.querySelector('section.items');

  jsonResults.forEach((item) => {
    itemsList.appendChild(createProductItemElement(item));
  });
}

async function addToCart(evt) {
  const cartItems = document.querySelector('ol.cart__items');

  const id = getSkuFromProductItem(evt);
  const fetchProduct = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const productJson = await fetchProduct.json();
  cartItems.appendChild(createCartItemElement(productJson));
}

function buttonsEvent() {
  const allButtons = document.querySelectorAll('button.item__add');

  allButtons.forEach((button) => {
    button.addEventListener('click', (evt) => {
      addToCart(evt);
    });
  });
}

window.onload = async () => {
  await requestAppendAPI();
  buttonsEvent();
};
