// Projeto feito com ajuda dos colegas: Igor Fernandes e Roberval Filho
const OlItem = document.querySelector('.cart__items');
const cartBtn = document.querySelector('.empty-cart');
const total = document.querySelector('.total-price');
let arrStorage = [];

const preLoader = () => {
  const body = document.querySelector('body');
  const loadMsg = document.querySelector('.loading');
  body.removeChild(loadMsg);
};

const getPrice = () => {
  let totalPrice = 0;
  arrStorage.forEach((element) => {
    totalPrice += element.price;
  });
  total.innerText = totalPrice;
};

const clearCart = () => {
  cartBtn.addEventListener('click', () => {
    localStorage.clear();
    OlItem.innerHTML = '';
    total.innerHTML = '';
  });
};

const storage = (value) => {
  arrStorage.push(value);
  const strStorage = JSON.stringify(arrStorage);
  localStorage.setItem('key', strStorage);
  getPrice();
};

const removeItemFromLS = (str) => {
  const strId = str.innerText.substr(5, 13);
  arrStorage = arrStorage.filter((item) => item.id !== strId);
  const strStorage = JSON.stringify(arrStorage);
  localStorage.setItem('key', strStorage);
  getPrice();
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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  OlItem.removeChild(event.target);
  removeItemFromLS(event.target);
  getPrice();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const cartShop = async (itemID) => {
  let fetchCart = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  fetchCart = await fetchCart.json();
  const olCart = document.querySelector('.cart__items');
  olCart.appendChild(createCartItemElement(fetchCart));
  storage(fetchCart);
};

const createButton = async () => {
  const product = document.querySelectorAll('.item');
  product.forEach((element) => {
    const btn = element.querySelector('button');
    btn.addEventListener('click', async () => {
      const elementSku = getSkuFromProductItem(element);
      await cartShop(elementSku);
    });
  });
};

const fetchPC = async () => {
  const tagSection = document.querySelector('.items');
  const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const apiFetch = await fetch(API_URL);
  const apiJson = await apiFetch.json();
  const jsonResults = apiJson.results;
  jsonResults.forEach((product) => {
    const productList = createProductItemElement(product);
    tagSection.appendChild(productList);
  });
};

const getLocalStorage = () => {
  if (localStorage.getItem('key') !== null) {
    arrStorage = JSON.parse(localStorage.getItem('key'));
    arrStorage.forEach((element) => {
      OlItem.appendChild(createCartItemElement(element));
    });
  }
  getPrice();
};

window.onload = async function onload() {
  await fetchPC();
  createButton();
  getLocalStorage();
  clearCart();
  preLoader();
};
