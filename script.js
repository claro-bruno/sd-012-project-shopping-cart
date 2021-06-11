const URL_PC = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const URL_ITEM = 'https://api.mercadolibre.com/items/';

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
  } catch (error) {
    alert(error);
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
  // coloque seu código aqui
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