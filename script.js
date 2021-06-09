const olItems = document.querySelector('.cart__items');
let cartItemsCounter = 0;
let totalPrice = 0;

function updateTotalPrice() {
  const getTotalPrice = document.querySelector('.total-price');
  getTotalPrice.innerText = totalPrice;
}

function emptyCart() {
  const { length } = document.querySelector('.cart > ol').childNodes;
  const getOl = document.querySelector('ol');
  for (let index = 0; index < length; index += 1) {
    getOl.firstChild.remove();
  }
  totalPrice = 0;
  updateTotalPrice();
}

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
  const savedItemLi = event.target.innerText;
  const dolarIndex = savedItemLi.indexOf('$');
  const savedItemPrice = savedItemLi.slice(dolarIndex + 1);
  totalPrice -= Number(savedItemPrice);
  updateTotalPrice();
  olItems.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function clickToAddItems(item, index) {
  const addItemButton = document.getElementsByClassName('item__add')[index];
  const itemID = item.id;
  addItemButton.addEventListener('click', async () => {
    const responseItem = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    const responseItemJSON = await responseItem.json();
    const liItem = createCartItemElement(responseItemJSON);
    const { price } = responseItemJSON;
    totalPrice += price;
    updateTotalPrice();
    olItems.appendChild(liItem);
    cartItemsCounter += 1;
    localStorage.setItem(`${cartItemsCounter}º Saved Item`, liItem.innerHTML);
  });
}

async function catchMercadoLivreAPI() {
  const sectionItems = document.querySelector('.items');
  const responseList = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const responseListJSON = await responseList.json();
  const productsList = responseListJSON.results;
  productsList.forEach((item, index) => {
    const product = createProductItemElement(item);
    sectionItems.appendChild(product);
    clickToAddItems(item, index);
  });
}

window.onload = function onload() {
  const getEmptyCartBtn = document.querySelector('.empty-cart');
  getEmptyCartBtn.addEventListener('click', emptyCart);
  catchMercadoLivreAPI();
  if (localStorage.length !== 0) {
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach((key) => {
      const savedLi = localStorage.getItem(key);
      const dolarIndex = savedLi.indexOf('$');
      const savedItemPrice = savedLi.slice(dolarIndex + 1);
      totalPrice += Number(savedItemPrice);
      updateTotalPrice();
      const setOnClick = 'onclick="cartItemClickListener(event)"';
      olItems.innerHTML += `<li class="cart__items" ${setOnClick}>${savedLi}</li>`;
    });
  }
};