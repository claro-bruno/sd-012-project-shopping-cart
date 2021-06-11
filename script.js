const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const itemsSection = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');

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

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
} */

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

function fetchApi() {
  fetch(url)
  .then((response) => response.json())
  .then((data) => data.results.forEach((element) => itemsSection
  .appendChild(createProductItemElement(element))));
}

function addToCart(id) {
  const productURL = `https://api.mercadolibre.com/items/${id}`;
  fetch(productURL)
  .then((response) => response.json())
  // .then((data) => console.log(data))
  .then((data) => cartItems.appendChild(createCartItemElement(data)));
}

function addButton() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const id = event.target.parentNode.firstElementChild.innerText;
      return addToCart(id);
    }
  });
}
/*
function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove()
}

function removeFromCart() {
  document.getElementsByClassName('cart__item').addEventListener('click', cartItemClickListener)
} */
window.onload = function onload() { 
  fetchApi();
  addButton();
  // removeFromCart()
};