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

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  // getId(event.target.parentElement.firstChild.innerText);
  // calculatePrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 1:

const jonas = document.getElementsByClassName('items');

const getAPI = async () => {
  let api = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  api = await api.json();
  api = await api.results.forEach((computador) => {
    const appenC = createProductItemElement(computador);
    jonas[0].appendChild(appenC);
  });
  return api;
};

const calculatePrice = () => {
  const totalPriceSelect = document.querySelector('.total-price');
  const selectCartItems = document.getElementsByClassName('cart__item');
  const arrayLi = [...selectCartItems];
  const resultArray = arrayLi.reduce((acc, curr) => {
    const priceText = curr.innerText.split('$')[1];
    const priceNumber = Number(priceText);
    return acc + priceNumber;
  }, 0);
  totalPriceSelect.innerText = resultArray;
};

// Requisito 2:
const cartItems = 'cart__items';
const cartChild = document.getElementsByClassName(cartItems)[0];
const cartChildLast = document.getElementsByClassName(cartItems).lastElementChild;
let local = document.querySelector(`.${cartItems}`);

const getId = async (id) => {
  const apiId = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const apiId1 = await apiId.json();
  cartChild.appendChild(createCartItemElement(apiId1));
  localStorage.setItem('set', local.innerHTML);
  calculatePrice();
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    getId(event.target.parentElement.firstChild.innerText);
    calculatePrice();
  }
});

// Requisito 3:

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('cart__item')) {
    event.target.remove();
    calculatePrice();
    localStorage.setItem('set', local.innerHTML);
  }
});

const emptyButton = () => {
  const emptySelect = document.querySelector('.empty-cart');
  emptySelect.addEventListener('click', () => {
  const selectCartItems = document.querySelector(`.${cartItems}`);
  selectCartItems.innerHTML = '';
  });
};

window.onload = function onload() {
  getAPI();
  local = document.querySelector('.cart__items');
  local.innerHTML = localStorage.getItem('set');
  emptyButton();
  calculatePrice();
};