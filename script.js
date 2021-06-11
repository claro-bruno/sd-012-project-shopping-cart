const getOlCartItems = document.querySelector('.cart__items');

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

// Requisito 5
const createTotalPrice = () => {
  const getSectionCart = document.querySelector('.cart');
  getSectionCart.appendChild(createCustomElement('footer', 'total-price', 'Preço Total:'));
};

// Requisito 5 - Referência: Natalia Souza - turma 11.
const sumPrices = () => {
  const turnCartItensIntoArray = Array(...document.querySelectorAll('.cart__item'));
  const getTotalPrices = document.querySelector('.total-price');
  const sumTotalPrices = turnCartItensIntoArray.reduce((acc, price) => 
  acc + Number(price.innerText.split('$')[1]), 0);
  getTotalPrices.innerText = sumTotalPrices;
};

// Requisito 6
const addClearEventToButtonCart = () => {
  const getButtonCart = document.querySelector('.empty-cart');
  getButtonCart.addEventListener('click', () => {
  getOlCartItems.innerHTML = null;
  sumPrices(); // chama a funçao para atualizar a soma após o carrinho ser esvaziado.
  });
};

// Requisito 3
function cartItemClickListener(event) {
  event.remove();
  sumPrices(); // chama a funçao para atualizar a soma após a retirada de um item do carrinho.
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

// Requisito 2 - Referência: Rodrigo Merlone.
const addProductToCart = async (idProduct) => {
  const apiURL = `https://api.mercadolibre.com/items/${idProduct}`;
  const response = await fetch(apiURL);
  const data = await response.json();
  getOlCartItems.appendChild(createCartItemElement(data));
  sumPrices(); // chama a funçao para atualizar a soma após a introduçao de um item no carrinho.
};

// Requisito 2 - Referência: Natalia Souza - turma 11.
const addEventListenerToItemsButtons = () => {
  const getItemsButtons = document.querySelectorAll('.item__add');
  getItemsButtons.forEach((button) => 
    button.addEventListener('click', (event) => 
      addProductToCart(getSkuFromProductItem(event.target.parentNode))));
};

// Requisito 1 - Referências: Natalia Souza - turma 11, Caroline Benichio. 
const addProductsToSectionItens = async () => {
  const getSectionItems = document.querySelector('.items');
  const apiURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const response = await fetch(apiURL);
  const data = await response.json();
  const arrayResults = data.results;
  await arrayResults.forEach((product) => 
  getSectionItems.appendChild(createProductItemElement(product)));
  addEventListenerToItemsButtons(); // chama a funçao para garantir que será executada após a criaçao da lista de produtos.
};

window.onload = function onload() {
  addProductsToSectionItens();
  createTotalPrice();
  addClearEventToButtonCart();
};
