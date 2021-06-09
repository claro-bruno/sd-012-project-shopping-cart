const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const buttons = document.querySelectorAll('.item__add');

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const createItemsList = (data) => {
  const items = document.querySelector('.items');
  const itemsList = data.results;
    itemsList.forEach((item) => {
      const itemElement = createProductItemElement(item);
      items.appendChild(itemElement);
    });
};

const fetchApi = async (url) => {
  await fetch(url)
    .then((response) => response.json())
    .then((data) => createItemsList(data));
};

window.onload = function onload() {
  fetchApi(API_URL);
};