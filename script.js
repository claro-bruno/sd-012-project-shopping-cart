const ol = document.getElementsByClassName('cart__items')[0];
const cart = document.getElementsByClassName('cart')[0];
const items = document.getElementsByClassName('items')[0];
const clearButton = document.getElementsByClassName('empty-cart')[0];
const divPrices = document.createElement('div');

const createTotalPrice = () => {
  divPrices.className = 'total-price';
  cart.appendChild(divPrices);
};

const createLoading = () => {
  const loading = document.createElement('span');
  loading.className = 'loading';
  loading.innerHTML = 'loading...';
  cart.appendChild(loading);
};

const removeLoading = () => {
  const loading = document.getElementsByClassName('loading')[0];
  loading.remove();
};

// requisito 7 resolvido baseado no projeto do colega Patrick Dack; Link da PR: https://github.com/tryber/sd-012-project-shopping-cart/pull/107/commits/cc4dc00790c09e8542a75fe8b15660c4fbd9f131

const clearEverything = () => {
  ol.innerHTML = '';
  localStorage.removeItem('cartItems');
  // função removeItem utilizada com a dica da colega Adriana Biberg
  divPrices.innerHTML = 0;
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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const sumPrices = () => {
  let num = 0;
  if (ol.childNodes !== null) {
    ol.childNodes.forEach((item) => {
      num += parseFloat(item.innerText.split('$')[1]);
    });
  } 
  divPrices.innerText = num;
};

function cartItemClickListener(event) {
  ol.removeChild(event.target);
  sumPrices();
}

const saveLocalStorage = () => {
  const array = [];
  if (ol.childNodes !== null) {
    ol.childNodes.forEach((cartItem) => {
      array.push(cartItem.innerText);
    });
    localStorage.setItem('cartItems', JSON.stringify(array));
  }
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', saveLocalStorage);
  li.addEventListener('click', sumPrices);
  sumPrices();
  return li;
}

const getItemInformation = (event) => {
  const element = event.target.parentElement;
  const id = getSkuFromProductItem(element);
  createLoading();
  return fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((object) => ol.appendChild(createCartItemElement(object)))
  .then(() => saveLocalStorage())
  .then(() => sumPrices())
  .then(() => removeLoading());
};

// const addItemToCart = (event) => {
//   getItemInformation(event)
// };

const createItems = () => {
  createLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((products) => products.results
    .forEach((product) => {
      const itemCreated = createProductItemElement(product);
      itemCreated.lastElementChild.addEventListener('click', getItemInformation);
      items.appendChild(itemCreated);
    }))
  .then(() => removeLoading());
};

const getSavedCart = () => {
  const savedCart = JSON.parse(localStorage.getItem('cartItems'));
  if (savedCart !== null) {
    savedCart.forEach((item) => {
      const newLi = document.createElement('li');
      newLi.innerText = item;
      newLi.addEventListener('click', cartItemClickListener);
      newLi.addEventListener('click', saveLocalStorage);
      ol.appendChild(newLi);
    });
  }
};

window.onload = function onload() {
  clearButton.addEventListener('click', clearEverything);
  createTotalPrice();
  getSavedCart();
  sumPrices();
  createItems();
};
