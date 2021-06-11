const itemsContainer = document.querySelector('.items');
const cartItemsContainer = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  event.target.remove();
  localStorage.setItem('actualCart', cartItemsContainer.innerHTML);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function fetchCartItem(event) {
  fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(event.target.parentNode)}`)
  .then((response) => response.json())
  .then((jsonData) => {
    cartItemsContainer.appendChild(createCartItemElement(jsonData));
    localStorage.setItem('actualCart', cartItemsContainer.innerHTML);
  });
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  const buttonAddToCart = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  buttonAddToCart.addEventListener('click', fetchCartItem);
  section.appendChild(buttonAddToCart);

  return section;
}

function fetchSearch(searchTerm) {
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${searchTerm}`)
  .then((response) => response.json())
  .then((jsonData) => {
    jsonData.results.forEach((product) => 
    itemsContainer.appendChild(createProductItemElement(product)));
  });
}

fetchSearch('computador');

// Aqui adicionei um event listener na página toda executando uma função para capturar quando o evento for realizado em algum item no carrinho, pois ao carregar o carrinho pelo localStorage não era possível removê-lo ao clicar em cima. 
// Feito com a grande ajuda do Bruno Yamamoto da Turma 12 da Trybe!

document.addEventListener('click', (event) => {
  if (event.target.className === 'cart__item') {
    cartItemClickListener(event);
  }
});

window.onload = function onload() {
  cartItemsContainer.innerHTML = localStorage.getItem('actualCart');
};
