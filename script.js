const URL_PC = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const URL_ITEM = 'https://api.mercadolibre.com/items/';
let priceT;
const totalPrice = document.querySelector('.total-price');
const ol = document.querySelector('.cart__items');

if (Number.isNaN(parseFloat(localStorage.getItem('total')))
  || localStorage.getItem('total') === null) {
  priceT = 0;
} else {
  priceT = parseFloat(localStorage.getItem('total'));
}

const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

const createProductItemElement = ({ id, title, thumbnail }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

const updatePrice = (total) => {
  const spanPrice = document.createElement('span');
  spanPrice.innerText = priceT;
  if (total.childElementCount === 0) {
    total.appendChild(spanPrice);
  } else {
    total.removeChild(total.lastChild);
    total.appendChild(spanPrice);
  }
};

const loadPrice = () => {
  updatePrice(totalPrice);
};

const sumPrice = (object) => {
  priceT += object.price;
  updatePrice(totalPrice);
  localStorage.setItem('total', priceT);
};

const subPrice = (number) => {
  priceT -= number;
  updatePrice(totalPrice);
  localStorage.setItem('total', priceT);
};

const saveStorage = () => {
  const array = [];
  for (let i = 0; i < ol.length; i += 1) {
    array.push(ol[i].outerHTML);
  }
  localStorage.setItem('pcs', JSON.stringify(array));
};

const listPcs = (array) => {
  const list = document.querySelector('.items');
  array.forEach((element) => {
    list.appendChild(createProductItemElement(element));
  });
};

const removeItens = () => {
  priceT = 0;
  const cart = document.querySelector('.cart');
  const totalText = document.querySelector('.total-text');
  cart.removeChild(totalText);
  cart.removeChild(ol);
  const newOl = document.createElement('ol');
  newOl.className = 'cart__items';
  cart.appendChild(newOl);
  saveStorage();
  const newTotalText = document.createElement('span');
  newTotalText.className = 'total-text';
  newTotalText.innerText = 'Total: R$ ';
  cart.appendChild(newTotalText);
  const newTotalPrice = document.createElement('span');
  newTotalPrice.className = 'total-price';
  newTotalText.appendChild(newTotalPrice);
  updatePrice(newTotalPrice);
  localStorage.setItem('total', priceT);
};

const buttonRemove = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', async () => removeItens());
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

const cartItemClickListener = (event) => {
  ol.removeChild(event.target);
  saveStorage();
  const liText = event.target.innerText;
  const indexIni = liText.indexOf('$');
  const number = parseFloat(liText.slice(indexIni + 1));
  subPrice(number);
};

const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const loadStorage = () => {
  const array = JSON.parse(localStorage.getItem('pcs'));
  if (array !== null) {
    for (let i = 0; i < array.length; i += 1) {
      const li = document.createElement('li');
      li.innerHTML = array[i];
      li.firstChild.addEventListener('click', cartItemClickListener);
      ol.appendChild(li.firstChild);
    }
  }
  loadPrice();
};

const addPc = async (url) => {
  try {
    const response = await fetch(url);
    const object = await response.json();
    ol.appendChild(createCartItemElement(object));
    sumPrice(object);
    saveStorage();
  } catch (error) {
    alert(error);
  }
};

const addClick = (array) => {
  array.forEach((element, index) => {
    const itemAdd = document.getElementsByClassName('item__add')[index];
    itemAdd.addEventListener('click', async () => addPc(`${URL_ITEM}${element.id}`));
  });
};

const getApi = async (url) => {
  try {
    const response = await fetch(url);
    const { results } = await response.json();
    listPcs(results);
    addClick(results);
    loadStorage();
    buttonRemove();
    removeLoading();
  } catch (error) {
    alert(error);
  }
};

window.onload = () => {
  getApi(URL_PC);
};