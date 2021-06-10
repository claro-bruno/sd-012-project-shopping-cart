const items = document.querySelector('.items');
const orderList = document.querySelector('.cart__items');

window.onload = function onload() {};

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

function cartItemClickListener(event) {
  return event.target.remove();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getId(event) {
  const data = event.target.parentElement;
  const id = getSkuFromProductItem(data);
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((product) => {
      const createCart = createCartItemElement(product);
      orderList.appendChild(createCart);
    });
}
// Requisito 2 cumprido com ajuda do colega Rodrigo Facury;

function fetchList() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((products) => products.results.forEach((product) => {
      const createItem = createProductItemElement(product);
      items.appendChild(createItem);
      createItem.lastChild.addEventListener('click', getId);
    }));      
}

fetchList();