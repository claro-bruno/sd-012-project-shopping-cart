const URL_PC = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const URL_ITEM = 'https://api.mercadolibre.com/items/';
let price;

if (parseFloat(localStorage.getItem('total')) === NaN || localStorage.getItem('total') === null) {
  price = 0;
} else {
  price = parseFloat(localStorage.getItem('total'));
}

console.log((price));

const listPcs = (array) => {
  const list = document.querySelector('.items');
  array.forEach(element => {
    list.appendChild(createProductItemElement(element));
  });
};

const getApi = async (url) => {
  try {
    const response = await fetch(url);
    const { results } = await response.json();
    listPcs(results);
    addClick(results);
    loadStorage();
  } catch (error) {
    alert(error);
  }
};

const saveStorage = () => {
  const array = [];
  const ol = document.querySelectorAll('.cart__item');
  for (let i = 0; i < ol.length; i += 1) {
    array.push(ol[i].outerHTML);
  }
  localStorage.setItem('pcs', JSON.stringify(array));
};

const loadStorage = () => {
  const ol = document.querySelector('.cart__items');
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
}

const updatePrice = (total) => {
  const spanPrice = document.createElement('span');
  spanPrice.innerText = price;
  if (total.childElementCount === 0) {
    total.appendChild(spanPrice);
  } else {
    total.removeChild(total.lastChild);
    total.appendChild(spanPrice);
  }
}

const loadPrice = () => {
  const total = document.querySelector('.total-price');
  updatePrice(total);
}

const sumPrice = (object) => {
  const total = document.querySelector('.total-price');
  price += object.price;
  updatePrice(total);
  localStorage.setItem('total', price);
};

const subPrice = (number) => {
  const total = document.querySelector('.total-price');
  price -= number;
  updatePrice(total);
  localStorage.setItem('total', price);
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

const createProductItemElement = ({ id, title, thumbnail }) => {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return section;
};

const getSkuFromProductItem = (item) => {
  return item.querySelector('span.item__sku').innerText;
};

const cartItemClickListener = (event) => {
  const ol = document.querySelector('.cart__items');
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

const addPc = async (url) => {
  try {
    const response = await fetch(url);
    const object = await response.json();
    const ol = document.querySelector('.cart__items');
    ol.appendChild(createCartItemElement(object));
    sumPrice(object);
    saveStorage();
  } catch (error) {
    alert(error);
  }
}

const addClick = (array) => {
  array.forEach((element, index) => {
    const item_add = document.getElementsByClassName('item__add')[index];
    item_add.addEventListener('click', async () => addPc (`${URL_ITEM}${element.id}`));
  });
};

window.onload = () => {
  getApi(URL_PC);
};