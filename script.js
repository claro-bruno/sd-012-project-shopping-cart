const URL_PC = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const URL_ITEM = 'https://api.mercadolibre.com/items/';
let priceT;

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

const loadPrice = (totalPrice) => {
  updatePrice(totalPrice);
};

const sumPrice = (object, totalPrice) => {
  priceT += object.price;
  updatePrice(totalPrice);
  localStorage.setItem('total', priceT);
};

const subPrice = (number, totalPrice) => {
  priceT -= number;
  updatePrice(totalPrice);
  localStorage.setItem('total', priceT);
};

const saveStorage = (ol) => {
  const lis = ol.children;
  const array = [];
  for (let i = 0; i < lis.length; i += 1) {
    array.push(lis[i].outerHTML);
  }
  localStorage.setItem('pcs', JSON.stringify(array));
};

const listPcs = (array) => {
  const list = document.querySelector('.items');
  array.forEach((element) => {
    list.appendChild(createProductItemElement(element));
  });
};

const removeItens = (ol) => {
  priceT = 0;
  const cart = document.querySelector('.cart');
  const totalText = document.querySelector('.total-text');
  cart.removeChild(totalText);
  cart.removeChild(ol);
  const newOl = document.createElement('ol');
  newOl.className = 'cart__items';
  cart.appendChild(newOl);
  saveStorage(newOl);
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

const buttonRemove = (ol) => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', async () => removeItens(ol));
};

const removeLoading = () => {
  const loading = document.querySelector('.loading');
  loading.remove();
};

const cartItemClickListener = (event) => {
  const olC = document.querySelector('.cart__items');
  const totalPriceC = document.querySelector('.total-price'); 
  olC.removeChild(event.target);
  saveStorage(olC);
  const liText = event.target.innerText;
  const indexIni = liText.indexOf('$');
  const number = parseFloat(liText.slice(indexIni + 1));
  subPrice(number, totalPriceC);
};

const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const loadStorage = (ol, totalPrice) => {
  const array = JSON.parse(localStorage.getItem('pcs'));
  if (array !== null) {
    for (let i = 0; i < array.length; i += 1) {
      const li = document.createElement('li');
      li.innerHTML = array[i];
      li.firstChild.addEventListener('click', cartItemClickListener);
      ol.appendChild(li.firstChild);
    }
  }
  loadPrice(totalPrice);
};

const addPc = async (url, ol, totalPrice) => {
  try {
    const response = await fetch(url);
    const object = await response.json();
    ol.appendChild(createCartItemElement(object));
    sumPrice(object, totalPrice);
    saveStorage(ol);
  } catch (error) {
    alert(error);
  }
};

const addClick = (array, ol, totalPrice) => {
  array.forEach((element, index) => {
    const itemAdd = document.getElementsByClassName('item__add')[index];
    itemAdd.addEventListener('click',
    async () => addPc(`${URL_ITEM}${element.id}`, ol, totalPrice));
  });
};

const getApi = async (url) => {
  try {
    const response = await fetch(url);
    const { results } = await response.json();
    const ol = document.querySelector('.cart__items');
    const totalPrice = document.querySelector('.total-price');
    listPcs(results);
    addClick(results, ol, totalPrice);
    loadStorage(ol, totalPrice);
    buttonRemove(ol);
    removeLoading();
  } catch (error) {
    alert(error);
  }
};

window.onload = () => {
  getApi(URL_PC);
};