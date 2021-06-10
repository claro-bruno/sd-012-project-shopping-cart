const baseURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const itemURL = 'https://api.mercadolibre.com/items/';
const cartItemsClass = '.cart__items';
const totalPriceClass = '.total-price';

const setCartListLocalStorage = () => {
  const listElement = document.querySelector(cartItemsClass);

  if (localStorage.getItem('cartList')) localStorage.removeItem('cartList');

  localStorage.setItem('cartList', listElement.innerHTML);
};

const increaseTotalPriceLocalStorage = async (sku) => {
  const itemFromApi = await fetch(`${itemURL}${sku}`);
  const itemObj = await itemFromApi.json();
  const itemPrice = itemObj.price;
  const totalElement = document.querySelector(totalPriceClass);
  let totalPrice = 0;

  if (localStorage.getItem('totalPrice') !== null) {
    totalPrice = Number(localStorage.getItem('totalPrice'));
  }

  totalPrice += itemPrice;
  
  localStorage.setItem('totalPrice', totalPrice);
  totalElement.innerText = localStorage.getItem('totalPrice');
};

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
  const parentElement = document.querySelector(cartItemsClass);

  parentElement.removeChild(event.target);

  setCartListLocalStorage();
}

const setListenerToCartList = () => {
  const cartList = document.querySelectorAll('.cart__item');

  cartList.forEach((item) => {
    item.addEventListener('click', cartItemClickListener);
  });
};

const getLocalStorage = () => {
  const listElement = document.querySelector(cartItemsClass);
  const totalElement = document.querySelector(totalPriceClass);

  if (localStorage.getItem('cartList')) listElement.innerHTML = localStorage.getItem('cartList');

  if (localStorage.getItem('totalPrice')) {
    totalElement.innerHTML = localStorage.getItem('totalPrice');
  }

  setListenerToCartList();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  li.addEventListener('click', () => {
    const totalElement = document.querySelector(totalPriceClass);
    let totalPrice = 0;
    if (localStorage.getItem('totalPrice') !== null) {
      totalPrice = Number(localStorage.getItem('totalPrice'));
    }
    totalPrice -= salePrice;
    localStorage.setItem('totalPrice', totalPrice);
    totalElement.innerText = localStorage.getItem('totalPrice');
  });
  return li;
}

const createItemList = async () => {
  const apiPromise = await fetch(baseURL);
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
      const itemFromApi = await fetch(`${itemURL}${itemID}`);
      const itemObj = await itemFromApi.json();
      const itemLi = createCartItemElement(itemObj);
      const parentElement = document.querySelector(cartItemsClass);
      const itemSKU = item.querySelector('.item__sku').innerHTML;
      parentElement.appendChild(itemLi);
      setCartListLocalStorage();
      increaseTotalPriceLocalStorage(itemSKU);
    });
  });
};

window.onload = async () => {
  await createItemList();
  addButtonsEvent();
  getLocalStorage();
};
