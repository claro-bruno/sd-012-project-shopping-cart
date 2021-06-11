const API_MERCADO_LIVRE = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
// const cartItem = document.querySelector('.cart_items');
const listOrdener = 'ol.cart__items';
const productList = 'product-list';

window.onload = function onload() {
  fetchListItems();
};

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

function fetchListItems() {
  const list = document.querySelector('.items');
  fetch(`${API_MERCADO_LIVRE}`)
    .then((response) => response.json())
    .then((response) => response.results)
    .then((items) => items.forEach((item) => 
      list.appendChild(createProductItemElement(item))));
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

function cartItemClickListener(event) {
  // código aqui
  const listItens = document.querySelector(listOrdener);
  event.target.remove();
  localStorage.setItem(`${productList}`, listItens.innerHTML);
}

/* function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} */
