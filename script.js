const BASE_ML = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const ERROR_MESSAGE = 'Algo de errado, tente novamente mais tarde!';

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const removeItens = document.getElementsByClassName('cart__item');
  event.target.remove(removeItens);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function addItens(event) {
  const removeItens = document.querySelector('.cart__items');
  const classItem = event.target.parentElement;
  const itemId = getSkuFromProductItem(classItem);
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
    const result = await response.json();
    removeItens.appendChild(createCartItemElement(result));
  } catch (error) {
    return (ERROR_MESSAGE);
  }
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', addItens);
  return section;
}

// Requisição da api e listagem de produtos

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
  const loading = document.querySelector('.loading');
  fetch(`${BASE_ML}computador`)
    .then((response) => response.json())
    .then((result) => getItens(result.results))
    .then(() => loading.remove());
}
//errei o commit
const clearCart = () => {
  const li = document.querySelectorAll('li.cart__item');
  li.forEach((removed) => removed.remove());
  localStorage.removeItem('cart');
  localStorage.removeItem('price');
};

const removeItensAll = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', clearCart);
};

window.onload = function onload() { 
  getApi();
  removeItensAll();
  };
