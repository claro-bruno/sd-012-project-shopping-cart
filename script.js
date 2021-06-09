const olItems = document.querySelector('.cart__items');
let cartItemsCounter = 0;

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
  catchMercadoLivreAPI();
  if (localStorage.length !== 0) {
    const localStorageKeys = Object.keys(localStorage);
    localStorageKeys.forEach((key) => {
      const savedLi = localStorage.getItem(key);
      olItems.innerHTML += `<li class="cart__items" onclick="itemListener(event)">${savedLi}</li>`;
    });
  }
};