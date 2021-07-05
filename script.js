function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function storeItems() {
  const containerItems = document.querySelector('ol');
  localStorage.setItem('items', containerItems.innerHTML);
}

function renderItems() {
  const containerItems = document.querySelector('ol');
  if (localStorage.items) {
    containerItems.innerHTML = localStorage.getItem('items');
  }
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }, callback) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  ).addEventListener('click', () => {
    callback(sku);
  });
  const productItems = document.querySelector('.items');
  productItems.appendChild(section);

  return section;
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  const containerItems = document.querySelector('.cart__items');
  containerItems.appendChild(li);
  li.addEventListener('click', cartItemClickListener);
  storeItems();
  return li;
}

async function requisitionIdIProduct(sku) {
  const responseId = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const responseIdJson = await responseId.json();
  createCartItemElement(responseIdJson);
}

async function requisitionProduct(product) {
  const response = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=${product}`,
  );
  const responseJson = await response.json();
  const { results } = responseJson;
  results.forEach((value) => {
    createProductItemElement(value, requisitionIdIProduct);
  });
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

window.onload = function onload() {
  requisitionProduct('computador');
  renderItems();
};
