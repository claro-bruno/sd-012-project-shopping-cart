window.onload = function onload() {};
const BASE_ML = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
// const currencyList = document.querySelector('.empty-cart');

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

function createProductItemElement({ id, title, thumbnail }) { // troca do sku, name, image, para o id, title, thumbnail
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id)); // troca do sku para o id
  section.appendChild(createCustomElement('span', 'item__title', title)); // troca do name para title
  section.appendChild(createProductImageElement(thumbnail)); // troca do image para thumbnail
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}
// Requisição da api

const getItens = (results) => {
  const objeto = {};
  const list = document.querySelector('.items');
  console.log(results);
  results.forEach((result) => {
    objeto.sku = result.id;
    objeto.name = result.title;
    objeto.image = result.thumbnail;
    const product = createProductItemElement(objeto);
    list.appendChild(product);
  });
};

function getApi() {
  fetch(`${BASE_ML}computador`)
  .then((response) => response.json())
  .then((result) => getItens(result.results));
}
/*
function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
*/
// Botao para limpar 
/*
function cleanRates() {
  currencyList.innerHTML = '';
}
*/

window.onload = function onload() {
  getApi();
};
