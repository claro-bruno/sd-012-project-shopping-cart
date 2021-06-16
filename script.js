const container = document.querySelector('.container');
const sectionItems = document.querySelector('.items');
const cart = document.querySelector('.cart__items');
const button = document.querySelector('.empty-cart');
const price = document.querySelector('.total-price');
const loading = document.querySelector('.loading');

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

function saveLocal() {
  const array = [];
  if (cart !== null) {
    cart.childNodes.forEach((element) => {
      array.push(element.innerText);
    });
    localStorage.setItem('array', JSON.stringify(array));
  }
}

function sumTotal() {
  let total = 0;
  if (cart.childNodes !== null) {
    cart.childNodes.forEach((element) => {
      total += parseFloat(element.innerText.split('$')[1]);
      price.innerText = total;
    });
  }
  if (cart.childNodes.length === 0) {
    price.innerText = 0;
  }
}

function cartItemClickListener(event) {
  event.target.remove();
  saveLocal();
  sumTotal();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.style.margin = '10px 0';
  li.addEventListener('click', cartItemClickListener);
  return li;
}

button.addEventListener('click', () => {
  price.innerText = 0;
  cart.innerHTML = '';
  localStorage.removeItem('array');
});

function addToCart(event) {
  const data = event.target.parentElement;
  const id = data.querySelector('span.item__sku').innerText;
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((product) => {
      const createCart = createCartItemElement(product);
      cart.appendChild(createCart);
      saveLocal();
      sumTotal();
    });
}

function fetchComputers() {
  loading.style.display = 'inline-block';
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
    .then((response) => response.json())
    .then((products) => products.results.forEach((product) => {
      const createdItem = createProductItemElement(product);
      sectionItems.appendChild(createdItem);
      createdItem.lastChild.addEventListener('click', addToCart);
    }))
    .then(() => {
      container.removeChild(loading);
    });
}

function getCart() {
  const savedCart = JSON.parse(localStorage.getItem('array'));
  if (savedCart !== null) {
    savedCart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerHTML = item;
      cart.appendChild(li);
      li.addEventListener('click', cartItemClickListener);
    });
  }
}

window.onload = function onload() {
  fetchComputers();
  getCart();
  sumTotal();
};