const mlbEndpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=$';
const itemEndpoint = 'https://api.mercadolibre.com/items/';

const itemsContainer = document.querySelector('.items');
const cartContainer = document.querySelector('.cart__items');

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener() {
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = ({ id: sku, title: name, price: salePrice }) => {
  const cartElement = createCartItemElement({ sku, name, salePrice });
  cartContainer.appendChild(cartElement);
};

const fetchAPI = (baseUrl, query, callback) => {
  fetch(`${baseUrl}${query}`)
    .then((response) => response.json())
      .then((object) => {
        callback(object);
      });
};

function itemClickListener(event) {
  if (event.target.className === 'item__add') {
    const itemId = getSkuFromProductItem(event.target.parentNode);
    fetchAPI(itemEndpoint, itemId, addToCart);
  }
}

const addItems = (object) => {
  const { results } = object;
  results.forEach(({ id: sku, title: name, thumbnail: image }) => {
    const element = createProductItemElement({ sku, name, image });
    element.addEventListener('click', itemClickListener);
    itemsContainer.appendChild(element);
  });
};

window.onload = function onload() { 
  fetchAPI(mlbEndpoint, 'computador', addItems);
};
