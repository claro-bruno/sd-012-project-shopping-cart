const getSectionProducts = document.querySelector('.items');
const getOlCartProducts = document.querySelector('.cart__items');

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

const createLoading = () => {
  getSectionProducts.appendChild(createCustomElement('p', 'loading', 'loading...'));
};

const createTotalPrice = () => {
  const getSectionCart = document.querySelector('.cart');
  getSectionCart.appendChild(createCustomElement('footer', 'total-price', 'Preço Total:'));
};

const sumPrices = () => {
  const turnCartItensIntoArray = Array(...document.querySelectorAll('.cart__item'));
  const getTotalPrices = document.querySelector('.total-price');
  const sumTotalPrices = turnCartItensIntoArray.reduce((acc, price) => 
  acc + Number(price.innerText.split('$')[1]), 0);
  getTotalPrices.innerText = sumTotalPrices;
};

const addClearEventToButtonCart = () => {
  const getButtonCart = document.querySelector('.empty-cart');
  getButtonCart.addEventListener('click', () => {
  getOlCartProducts.innerHTML = null;
  sumPrices();
  });
};

function cartItemClickListener(event) {
  event.remove();
  sumPrices();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', (event) => cartItemClickListener(event.target));
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const addProductToCart = async (idProduct) => {
  const apiURL = `https://api.mercadolibre.com/items/${idProduct}`;
  const response = await fetch(apiURL);
  const data = await response.json();
  getOlCartProducts.appendChild(createCartItemElement(data));
  sumPrices(); 
};

const addEventListenerToItemsButtons = () => {
  const getItemsButtons = document.querySelectorAll('.item__add');
  getItemsButtons.forEach((button) => 
    button.addEventListener('click', (event) => 
      addProductToCart(getSkuFromProductItem(event.target.parentNode))));
};

const addProductsToSectionItens = async () => {
  const apiURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(apiURL);
  const data = await response.json();
  const arrayResults = data.results;
  document.querySelector('.loading').remove(); 
  await arrayResults.forEach((product) => 
  getSectionProducts.appendChild(createProductItemElement(product)));
  addEventListenerToItemsButtons(); 
};

window.onload = function onload() {
  addProductsToSectionItens();
  createTotalPrice();
  addClearEventToButtonCart();
  createLoading();
};