const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const itemsSection = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');
let price = 0;

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
  price += Math.round(salePrice * 100) / 100;
  totalPrice.innerHTML = price;
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
  .then((data) => {
    cartItems.appendChild(createCartItemElement(data));
    window.localStorage.setItem('itemsCarrinho', cartItems.innerHTML);
  });
}

function addButton(event) {
    if (event.target.classList.contains('item__add')) {
      const id = event.target.parentNode.firstElementChild.innerText;
      addToCart(id);
    }
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  if (event.target.classList.contains('cart__item')) {
  const stringValue = event.target.innerText.match(/\d+.\d+$/gm);
  price -= Math.round(parseFloat(stringValue) * 100) / 100;
  totalPrice.innerHTML = price;
  event.target.remove();
  }
  window.localStorage.setItem('itemsCarrinho', cartItems.innerHTML);
}

function removeAll(event) {
  if (event.target.classList.contains('empty-cart')) {
    cartItems.innerHTML = '';
    price = 0;
    totalPrice.innerHTML = price;
  }
  window.localStorage.setItem('itemsCarrinho', cartItems.innerHTML);
}

window.onload = function onload() { 
  fetchApi();
  const listaSalva = localStorage.getItem('itemsCarrinho');
  cartItems.innerHTML = listaSalva;
};

document.addEventListener('click', cartItemClickListener);
document.addEventListener('click', removeAll);
document.addEventListener('click', addButton);