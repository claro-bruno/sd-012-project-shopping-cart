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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  const parentElement = document.querySelector('.cart__items');

  parentElement.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const createItemList = async () => {
  const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const apiPromise = await fetch(URL);
  const apiObj = await apiPromise.json();
  const itemResults = apiObj.results;
  const parentElement = document.querySelector('.items');

  itemResults
    .forEach((item) => parentElement
      .appendChild(createProductItemElement(item)));
};

const addButtonsEvent = async () => {
  const itemList = document.querySelectorAll('.item');
  
  itemList.forEach((item) => {
    const button = item.querySelector('button');
    button.addEventListener('click', async () => {
      const itemID = getSkuFromProductItem(item);
      const itemFromApi = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
      const itemObj = await itemFromApi.json();
      const itemLi = createCartItemElement(itemObj);
      const parentElement = document.querySelector('.cart__items');

      parentElement.appendChild(itemLi);
    });
  });
};

const asyncFunctions = async () => {
  await createItemList();
  addButtonsEvent();
};

window.onload = function onload() {
  asyncFunctions();
};
