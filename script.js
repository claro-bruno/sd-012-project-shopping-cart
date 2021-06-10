const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

let arrayCart = localStorage.getItem('Cart');
const getList = () => {
  const cart = document.getElementById('cart__items');
  const li = document.createElement('li');
  if (arrayCart.length > 1) {
    li.innerHTML = arrayCart;
    cart.appendChild(li);
  } else {
    arrayCart = [];
  }
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductItemElement = ({ id: sku, title: name, thumbnail: image }) => {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};

const getSkuFromProductItem = (item) => item.querySelector('span.item__sku').innerText;

const cartItemClickListener = (event) => {
  const cart = document.getElementById('cart__items');
  cart.removeChild(event.target);
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const cart = document.getElementById('cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  cart.appendChild(li);
  arrayCart.push(cart.innerHTML);
  localStorage.setItem('Cart', arrayCart);
  li.addEventListener('click', (event) => cartItemClickListener(event));
  return li;
};

const createItemsList = (data) => {
  const items = document.querySelector('.items');
  const itemsList = data.results;
    itemsList.forEach((item) => {
      const itemElement = createProductItemElement(item);
      items.appendChild(itemElement);
    });
};

const fetchApi = (url) => 
  new Promise((resolve) => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => createItemsList(data))
      .then((itemsList) => resolve(itemsList));
  });

const buttonAddCart = () => {
  const buttons = document.querySelectorAll('.item__add');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
    const id = button.parentNode.firstChild.innerText;
    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((item) => createCartItemElement(item));
    });
  });
};

const buttonEmptyCart = () => {
  const buttonEmpty = document.getElementById('empty-cart');
  const cart = document.getElementById('cart__items');
  buttonEmpty.addEventListener('click', () => {
    cart.innerHTML = '';
    localStorage.setItem('Cart', []);
  });
};

window.onload = function onload() {
  fetchApi(API_URL).then(() => buttonAddCart());
  getList();
  buttonEmptyCart();
};