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

function checkResponse(response) {
  if (response.ok) return response.json();
  throw new Error('Ocorreu um erro com a requisição');
}

function fetchApi(url) {
  return fetch(url)
    .then((response) => checkResponse(response))
    .catch((err) => console.log(err));
}

function removeItemStorage(item) {
  const skuRemove = item.innerText.split('|')[0].replace(/SKU:\s/g, '').trim();
  const items = localStorage.getItem('cart');
  const listItems = JSON.parse(items);
  const newList = listItems.filter(({ sku }) => sku !== skuRemove);
  localStorage.setItem('cart', JSON.stringify(newList));
}

function cartItemClickListener(event) {
  const item = event.target;
  item.parentElement.removeChild(item);
  removeItemStorage(item);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addInLocalStorage(item) {
  const items = localStorage.getItem('cart') || '[]';
  const listItems = JSON.parse(items);
  listItems.push(item);
  localStorage.setItem('cart', JSON.stringify(listItems));
}

function addItemInCart(event) {
  const cartItem = document.querySelector('.cart__items');
  const id = event.target.parentNode.firstChild.innerText;
  fetchApi(`https://api.mercadolibre.com/items/${id}`)
    .then(({ id: sku, title: name, price: salePrice }) => {
      cartItem.appendChild(createCartItemElement({ sku, name, salePrice }));
      addInLocalStorage({ sku, name, salePrice });
    })
    .catch((err) => console.log(err));
}   

function addBtnEvent() {
  const btnArray = document.querySelectorAll('.item__add');
  btnArray.forEach((btn) => {
    btn.addEventListener('click', (event) => addItemInCart(event));
  });
}

function addItems(results) {
  const items = document.querySelector('.items');
  const arrayResults = results
    .map(({ id: sku, title: name, thumbnail: image }) => ({ sku, name, image }));
  arrayResults.forEach((objResult) => items.appendChild(createProductItemElement(objResult)));
  addBtnEvent();
}

function loadCart() {
  const cartItem = document.querySelector('.cart__items');
  const items = localStorage.getItem('cart') || '[]';
  const listItems = JSON.parse(items); 
  listItems.forEach((item) => {
    cartItem.appendChild(createCartItemElement(item));
  });
}

window.onload = function onload() { 
  loadCart();
  fetchApi('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then(({ results }) => addItems(results))
    .catch((err) => console.log(err));
};
// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

// function createCartItemElement({ sku, name, salePrice }) {
//   const li = document.createElement('li');
//   li.className = 'cart__item';
//   li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
//   li.addEventListener('click', cartItemClickListener);
//   return li;
// };
