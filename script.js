const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const sectionItems = document.querySelector('.items');
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
      event.target.remove();
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getApi = async () => {
  const promiseApi = await fetch(url);
  const response = await promiseApi.json();
  response.results.forEach((item) => {
    sectionItems.appendChild(createProductItemElement(item));
  });
};

const getApiId = async (id) => {
  const promiseId = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const response = await promiseId.json();
  cartItems.appendChild(createCartItemElement(response));
};

const evtBtn = () => {
  sectionItems.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const id = getSkuFromProductItem(event.target.parentElement);
     getApiId(id);
    }
  });
};

// const evtBtn = () => {
//   const btnAdd = document.getElementsByClassName('item__add');
//   console.log(btnAdd)
//   btnAdd.forEach((button) => button.addEventListener('click', (event) => {
//     getApiId(getSkuFromProductItem(event.target.parentElement));
//     console.log(event.target)
//   }));
// }

window.onload = function onload() {
  getApi();
  evtBtn();
 };