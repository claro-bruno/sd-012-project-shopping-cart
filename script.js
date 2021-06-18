const APIURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const cartItems = document.querySelector('.cart__items');

function saveOnStorage() { 
  localStorage.setItem('cartItem', cartItems.innerHTML);
}

function LoadFromStorage() {
  const getItem = localStorage.getItem('cartItem');
  cartItems.innerHTML = getItem;
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

function createCartItemElement({ id: sku, title: name, price: salePrice }) { 
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  /* li.addEventListener('click', cartItemClickListener);  */
  return li;
}

function addCartItem(ItemID) {
  const productURL = `https://api.mercadolibre.com/items/${ItemID}`;
  fetch(productURL)
  .then((response) => response.json())
  .then((response) => {
    cartItems.appendChild(createCartItemElement(response));
    saveOnStorage();
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function clearCart(event) {
  if (event.target.className === 'empty-cart') {
    cartItems.innerHTML = '';
  }
  saveOnStorage();
}

function cartItemClickListener(event) {
  const target = event.target.className;
  if (target === ('item__add')) {
    const tag = event.target.parentNode;
    const itemSku = getSkuFromProductItem(tag);
    addCartItem(itemSku);
  }
  if (target === ('cart__item')) event.target.remove();
  saveOnStorage();
  clearCart(event);
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

function getItems() {
  const sectionItems = document.querySelector('.items');
  fetch(APIURL)
  .then((response) => response.json())
  .then((response) => response.results.forEach((current) => {
  sectionItems.appendChild(createProductItemElement(current));
  }));
}

window.onload = function onload() {
  LoadFromStorage();
  getItems();
  document.addEventListener('click', cartItemClickListener);
};
