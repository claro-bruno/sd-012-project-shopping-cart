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
/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
 } */
 const addStorage = (cart) => {
  localStorage.setItem('cart', cart.innerHTML);
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

function cartItemClickListener(event) {
  const li = event.target;
  const oList = li.parentNode;
  const priceItem = parseFloat(li.innerText.split('$')[1]);
  oList.removeChild(event.target);
  addStorage(oList);
  updateCartPrice(priceItem * -1);
}

function createCartItemElement({ sku, name, salePrice }) {
  const list = document.createElement('li');
  list.className = 'cart__item';
  list.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  list.addEventListener('click', cartItemClickListener);
  return list;
}
// 1
const getPromiseProducts = () => new Promise((resolve) => {
    fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json().then((computer) => resolve(computer)));
  });

const addProductsToPage = (promise) => {
  const items = document.querySelector('.items');
  const loading = createCustomElement('h1', 'loading', 'LOADING...');
  items.appendChild(loading);
  return promise.then((computer) => {
    items.removeChild(loading);
    computer.results.forEach((item) => {
      const { id: sku, title: name, thumbnail: image } = item;
      const theItem = createProductItemElement({ sku, name, image });
      items.appendChild(theItem);
    });
  });
};
// 2
const getItem = (itemId) => new Promise((resolve) => {
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
  .then((response) => response.json().then((computer) => resolve(computer)));
});
const addProduct = (promise) => {
const cart = document.querySelector('.cart__items');
promise.then((item) => {
  const { id: sku, title: name, price: salePrice } = item;
  const liItem = createCartItemElement({ sku, name, salePrice });
  cart.appendChild(liItem);
  addStorage(cart);
  updateCartPrice(salePrice);
});
};
const addCart = () => {
const arrayItem = Array.from(document.getElementsByClassName('item'));
arrayItem.forEach((item) => {
  const sku = item.querySelector('.item__sku').innerText;
  const button = item.querySelector('.item__add');
  button.addEventListener('click', () => addProduct(getItem(sku)));
});
};
const getPrice = () => {
  const price = localStorage.getItem('price');
  updateCartPrice(price);
};
const getStorage = () => {
  const storage = localStorage.getItem('cart');
  if (storage) {
    const cart = document.querySelector('.cart__items');
    cart.innerHTML = storage;
    Array.from(cart.children).forEach((li) => {
      li.addEventListener('click', cartItemClickListener);
    });
  }
};

const cleanCart = () => {
  const cart = document.querySelector('ol');
  const button = document.querySelector('.empty-cart');
  const priceParagraph = document.querySelector('.total-price');
  button.addEventListener('click', () => {
    while (cart.firstChild) cart.removeChild(cart.firstChild);
    if (priceParagraph) priceParagraph.innerText = 0;
    addStorage(cart);
    addPriceStorage(0);
  });
};

window.onload = function onload() {
  addProductsToPage(getPromiseProducts()).then(() => addCart());
  getStorage();
  getPrice();
  cleanCart();
 };