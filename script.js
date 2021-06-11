// Variáveis Globais
let cartProducts = [];

// Add Local Storage

const addCartStorage = (array) => {
  localStorage.setItem('cart', JSON.stringify(array));
};

const addPriceStorage = (totalPrice) => {
  localStorage.setItem('price', totalPrice);
};

const updateCartPrice = (price = 0) => {
  const priceParagraph = document.querySelector('.total-price');
  const actualPrice = parseFloat(priceParagraph.innerHTML).toFixed(2);
  const totalPrice = parseFloat(actualPrice) + price;
  priceParagraph.innerHTML = parseFloat(Math.round(totalPrice * 100) / 100);
  addPriceStorage(totalPrice);
};

// Funções Auxiliares

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

function createProductItemElement({ sku, name, image }) {
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
  const li = event.target;
  const ol = li.parentNode;
  const priceItem = parseFloat(li.innerText.split('$')[1]);
  ol.removeChild(event.target);
  const indexToRemove = cartProducts.reduce((acc, currentValue, index) => {
    const liSku = li.innerText.substr(5, 13);
    const indexLi = liSku !== currentValue.sku ? acc : index;
    return indexLi;
  }, 0);
  cartProducts.splice(indexToRemove, 1);
  addCartStorage(cartProducts);
  updateCartPrice(priceItem * -1);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Requisito 1

const getPromiseProducts = () => new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json().then((computer) => resolve(computer)));
  });

const addProductsToPage = (promise) => {
  const sectionItems = document.querySelector('.items');
  const loading = createCustomElement('h1', 'loading', 'LOADING...');
  sectionItems.appendChild(loading);
  return promise.then((computer) => {
    sectionItems.removeChild(loading);
    computer.results.forEach((item) => {
      const { id: sku, title: name, thumbnail: image } = item;
      const sectionItem = createProductItemElement({ sku, name, image });
      sectionItems.appendChild(sectionItem);
    });
  });
};

// Requisito 2

const getPromiseItem = (itemId) => new Promise((resolve) => {
    fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((response) => response.json().then((computer) => resolve(computer)));
  });

const addToCart = (itemObj) => {
    const cart = document.querySelector('.cart__items');
    const itemLi = createCartItemElement(itemObj);
    cart.appendChild(itemLi);
};

const addProductToCart = (promise) => {
  promise.then((item) => {
    const { id: sku, title: name, price: salePrice } = item;
    addToCart({ sku, name, salePrice });
    cartProducts.push({ sku, name, salePrice });
    addCartStorage(cartProducts);
    updateCartPrice(salePrice);
  });
};

const buttonClickProducts = () => {
  const itemsArray = Array.from(document.getElementsByClassName('item'));
  itemsArray.forEach((item) => {
    const sku = item.querySelector('.item__sku').innerText;
    const button = item.querySelector('.item__add');
    button.addEventListener('click', () => addProductToCart(getPromiseItem(sku)));
  });
};

const cleanCart = () => {
  const cart = document.querySelector('ol');
  while (cart.firstChild) cart.removeChild(cart.firstChild);
};

// Get Local Storage

const getPriceStorage = () => {
  const priceStorage = localStorage.getItem('price');
  updateCartPrice(priceStorage);
};

const getcartStorage = () => {
  const cartStorage = localStorage.getItem('cart');
  if (cartStorage) {
    cleanCart();
    cartProducts = JSON.parse(cartStorage);
    cartProducts.forEach((product) => addToCart(product));
  }
};

const emptyListenner = () => {
  const button = document.querySelector('.empty-cart');
  const priceParagraph = document.querySelector('.total-price');
  button.addEventListener('click', () => {
    cleanCart();
    cartProducts = [];
    if (priceParagraph) priceParagraph.innerText = 0;
    addCartStorage(cartProducts);
    addPriceStorage(0);
  });
};

window.onload = function onload() {
  getcartStorage();
  getPriceStorage();
  addProductsToPage(getPromiseProducts()).then(() => buttonClickProducts());
  emptyListenner();
 };
