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
  
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getItemInformation = (event) => {
  const element = event.target.parentElement;
  const id = getSkuFromProductItem(element);
  return fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json());
} 

const ol = document.getElementsByClassName('cart__items')[0];

const addItemToCart = (event) => {
  getItemInformation(event)
    .then((object) => ol.appendChild(createCartItemElement(object)));
};

const items = document.getElementsByClassName('items')[0];

const createItems = () => {
fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
.then((response) => response.json())
.then((products) => products.results
  .forEach((product) => {
    const itemCreated = createProductItemElement(product);
    itemCreated.addEventListener('click', addItemToCart);
    items.appendChild(itemCreated);
  }));
};

createItems();
