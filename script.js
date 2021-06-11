const BASE_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const ITEM_URL = 'https://api.mercadolibre.com/items/';
const CART_ITEMS = '.cart__items';
let itemStorage = [];

const updateTotalPrice = () => {
  const totalPrice = itemStorage.reduce((acc, { price }) => acc + price, 0);
  const totalElement = document.querySelector('.total-price');
  totalElement.innerText = totalPrice;
};

const addLocalStorage = (item) => {
  itemStorage.push(item);
  const itemStorageString = JSON.stringify(itemStorage);
  localStorage.setItem('teste', itemStorageString);
  updateTotalPrice();
};

const rmvLocalStorage = (cartItem) => {
  const itemSKU = cartItem.innerText.substr(5, 13);
  itemStorage = itemStorage.filter((item) => item.id !== itemSKU);
  const itemStorageString = JSON.stringify(itemStorage);
  localStorage.setItem('teste', itemStorageString);
  updateTotalPrice();
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
  const parentElement = document.querySelector(CART_ITEMS);
  parentElement.removeChild(event.target);
  rmvLocalStorage(event.target);
};

const createCartItemElement = ({ id: sku, title: name, price: salePrice }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
};

const getLocalStorage = () => {
  if (localStorage.getItem('teste') !== null) {
    itemStorage = JSON.parse(localStorage.getItem('teste'));
    itemStorage.forEach((item) => {
      const parentElement = document.querySelector(CART_ITEMS);
      parentElement.appendChild(createCartItemElement(item));
    });
  }
  updateTotalPrice();
};

const createItemList = async (item) => {
  const apiPromise = await fetch(`${BASE_URL}${item}`);
  const apiObj = await apiPromise.json();
  const itemResults = apiObj.results;
  const parentElement = document.querySelector('.items');
  itemResults
    .forEach((element) => parentElement
      .appendChild(createProductItemElement(element)));
};

const addButtonsEvent = async () => {
  const itemList = document.querySelectorAll('.item');
  itemList.forEach((item) => {
    const button = item.querySelector('button');
    button.addEventListener('click', async () => {
      const itemID = getSkuFromProductItem(item);
      const itemFromApi = await fetch(`${ITEM_URL}${itemID}`);
      const itemObj = await itemFromApi.json();
      const parentElement = document.querySelector(CART_ITEMS);
      parentElement.appendChild(createCartItemElement(itemObj));
      addLocalStorage(itemObj);
    });
  });
};

const eraseCart = () => {
  const eraseButton = document.querySelector('.empty-cart');
  eraseButton.addEventListener('click', () => {
    const cartItems = document.querySelector(CART_ITEMS);
    const totalPrice = document.querySelector('.total-price');
    itemStorage = [];
    cartItems.innerHTML = '';
    totalPrice.innerHTML = '';
    localStorage.clear();
  });
};

const removeLoading = () => {
  const parentElement = document.querySelector('body');
  const element = document.querySelector('.loading');
  parentElement.removeChild(element);
};

window.onload = async () => {
  await createItemList('computador');
  addButtonsEvent();
  getLocalStorage();
  eraseCart();
  removeLoading();
};
