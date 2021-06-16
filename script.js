const items = document.getElementsByClassName('items')[0];
const cartList = document.getElementsByClassName('cart__items')[0];

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

function createProductItemElement({ id: sku, tittle: name, thumbnail: image }) {
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

const fetchID = (event) => {
  const info = event.target.parentElement;
  const id = getSkuFromProductItem(info);
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((product) => {
    const createCart = createCartItemElement(product);
    cartList.appendChild(createCart);
  });
};

const fetchAPI = () => {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
  fetch(url)
  .then((response) => response.json())
  .then((products) => products.results
  .forEach((product) => {
    const createItem = createProductItemElement(product);
    items.appendChild(createItem);
    createItem.lastChild.addEventListener('click', fetchID);
  }));
};

fetchAPI();

// window.onload = function onload() { };
