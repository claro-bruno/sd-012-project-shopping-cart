const API_ML = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const URL_ITEM = 'https://api.mercadolibre.com/items/';

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
function fetchProducts() {
  const listItens = document.querySelector('.items');
  fetch(API_ML)
    .then((response) => response.json())
    .then(({ results }) => results.forEach((infoProduct) => {
      listItens.appendChild(createProductItemElement(infoProduct));
    }));
}
/* 
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}
*/
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  const list = document.querySelector('.cart__items');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  list.appendChild(li);
/*   li.addEventListener('click', cartItemClickListener);
  return li; */
}

function fetchForId(id) {
  fetch(`${URL_ITEM}${id}`)
  .then((response) => response.json())
  .then((results) => createCartItemElement(results));
 }

function listenEventAddToCart() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const addressId = event.target.parentElement.firstElementChild.innerText;
      fetchForId(addressId);
    }
  });
}

window.onload = function onload() {
  fetchProducts();
  listenEventAddToCart();
};