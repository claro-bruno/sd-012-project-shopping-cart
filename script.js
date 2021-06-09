const total = '.total-price';

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

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function removingTotalToStorage(li) {
  const totalPrice = document.querySelector(total);
  const valor = li.innerText.split('$')[1];
  let somaProdutos;
  const price = 'shopPrice';
  somaProdutos = Number(localStorage.getItem(price));
  somaProdutos -= Number(valor);
  localStorage.setItem(price, somaProdutos);
  totalPrice.innerText = localStorage.getItem(price);
}

function cartItemClickListener(event) {
  const lista = document.querySelector('ol');
  removingTotalToStorage(event.target);
  lista.removeChild(event.target);
  localStorage.setItem('shopCart', lista.innerHTML);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addingTotalToStorage(product) {
  const totalPrice = document.querySelector(total);
  if (!product) {
    totalPrice.innerText = localStorage.getItem('shopPrice');
    return;
  }
  let somaProdutos;
  if (!localStorage.getItem('shopPrice')) somaProdutos = 0;
  else somaProdutos = Number(localStorage.getItem('shopPrice'));
  somaProdutos += Number(product.price);
  localStorage.setItem('shopPrice', somaProdutos);
  totalPrice.innerText = localStorage.getItem('shopPrice');
}

function addingLoading() {
  const body = document.querySelector('body');
  const loading = document.createElement('h1');
  loading.classList.add('loading');
  loading.innerText = 'loading...';
  body.appendChild(loading);
}

function removeLoading() {
  const loading = document.querySelector('.loading');
  const body = document.querySelector('body');
  body.removeChild(loading);
}

function itemClickListener() {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => {
    const button = item.querySelector('button');
    const id = getSkuFromProductItem(item);
    button.addEventListener('click', async () => {
     await fetch(`https://api.mercadolibre.com/items/${id}`).then((response) => {
        addingLoading();
        return response.json();
      }).then((product) => {
        const lista = document.querySelector('.cart__items');
        const produto = createCartItemElement(product);
        lista.appendChild(produto);
        localStorage.setItem('shopCart', lista.innerHTML);
        addingTotalToStorage(product);
      });
      removeLoading();
    });
  });
}

async function fetchingProducts() {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
  .then((response) => response.json())
  .then((data) => data.results)
  .then((results) => {
    results.forEach((product) => {
      const items = document.querySelector('.items');
      const newItem = createProductItemElement(product);
      items.appendChild(newItem);
    });
    removeLoading();
  });
  itemClickListener();
}

function clearingCart() {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', () => {
    const listaCarrinho = document.querySelector('ol');
    listaCarrinho.innerHTML = '';
    localStorage.setItem('shopCart', listaCarrinho.innerHTML);
    localStorage.setItem('shopPrice', 0);
    const totalPrice = document.querySelector(total);
    totalPrice.innerText = localStorage.getItem('shopPrice');
  });
}

window.onload = function onload() { 
  const listaCarrinho = document.querySelector('ol');
  listaCarrinho.innerHTML = localStorage.getItem('shopCart');
  const li = listaCarrinho.querySelectorAll('li');
  li.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
  fetchingProducts();
  addingTotalToStorage();
  clearingCart();
};