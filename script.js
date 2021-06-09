const items = document.getElementsByClassName('items');
const cartItems = document.getElementsByClassName('cart__items');

function sumProducts() {
  const precos = document.querySelectorAll('.cartPrice');
  const totalPrice = document.querySelector('.total-price');
  let total = 0;
  precos.forEach((preco) => { total += Number(preco.innerText); });
  totalPrice.innerText = total;
}

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

function cartItemClickListener({ target }) {
  target.remove();
  localStorage.setItem('items', JSON.stringify(cartItems[0].innerHTML));
  setTimeout(sumProducts, 2000);
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerHTML = `SKU: ${id} | NAME: ${title} | PRICE: $<span class='cartPrice'>${price}</span>`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const loaded = () => {
  const load = document.querySelector('.loading');
  const container = document.querySelector('.container');
  load.remove();
  container.style.display = 'flex';
};

const fetchProducts = async () => {
  let results = [];
  results = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  results = await results.json();
  results = await results.results;
  results.forEach((computador) => {
    items[0].appendChild(createProductItemElement(computador));
  });
  loaded();
};

const fetchCart = async (id) => {
  let product = await fetch(`https://api.mercadolibre.com/items/${id}`);
  product = await product.json();
  cartItems[0].appendChild(createCartItemElement(product));
  localStorage.setItem('items', JSON.stringify(cartItems[0].innerHTML));
  setTimeout(sumProducts, 2000);
};

document.addEventListener('click', ({ target }) => {
  if (target.classList.contains('item__add')) {
    fetchCart(target.parentElement.children[0].innerText);
  } else if (target.classList.contains('empty-cart')) {
    cartItems[0].innerHTML = '';
    localStorage.setItem('items', JSON.stringify(cartItems[0].innerHTML));
  }
});

window.onload = function onload() {
  fetchProducts();
  cartItems[0].innerHTML = JSON.parse(localStorage.getItem('items'));
  cartItems[0].childNodes.forEach((li) => li.addEventListener('click', cartItemClickListener));
};
