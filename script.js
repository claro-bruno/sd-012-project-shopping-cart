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
  const olElement = document.querySelector('.cart__items');
  olElement.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function fetchComputerAPI() {
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await response.json();
  results.forEach((item) => {
    const product = createProductItemElement(item);
    document.getElementsByClassName('items')[0].appendChild(product);
  }); 
} 

async function fetchComputerByID(itemID) {
  const url = `https://api.mercadolibre.com/items/${itemID}`;
  const response = await fetch(url);
  const data = await response.json();
  const olElement = document.querySelector('.cart__items');
  const liElement = createCartItemElement(data);
  olElement.appendChild(liElement);
}

function addItemToCart() {
  const items = document.querySelector('.items');
  items.addEventListener('click', (event) => {
    if (event.target.className === 'item__add') {
      const itemID = getSkuFromProductItem(event.target.parentElement);
      fetchComputerByID(itemID);
    }
  });
}

window.onload = async function onload() { 
  await fetchComputerAPI();
  addItemToCart();
};