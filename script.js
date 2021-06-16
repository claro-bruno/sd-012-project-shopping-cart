const loading = document.querySelector('.loading');
  
function loadingRemove() {
  loading.remove(); 
}
const carr = document.querySelector('.cart__items');

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

function total() {
  const totalItems = document.querySelectorAll('.cart__item');
  let totalPrice = 0;
  totalItems.forEach((item) => {
    const price = parseFloat(item.innerHTML.split('$')[1]);
    totalPrice += price;
  });
  document.querySelector('.total-price').innerHTML = Math.round(totalPrice * 100) / 100;
}

function cartItemClickListener({ target }) {
  // coloque seu código aqui
  target.remove();
  total();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const searchComputer = async () => {
  const apiFetch = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const fetchJson = await apiFetch.json();
  const apiResults = fetchJson.results;
  const selectItem = document.querySelector('.items');
  loading.innerHTML = 'Loading...';
  apiResults.forEach((products) => 
  selectItem.appendChild(createProductItemElement(products)));
  loadingRemove();
};

const searchId = async (id) => {
  const apiFetch = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const computer = await apiFetch.json();
  const { id: sku, title: name, price: salePrice } = await computer;
  const productStorage = await createCartItemElement({ sku, name, salePrice });
  await carr.appendChild(productStorage);
  localStorage.setItem(`${localStorage.length + 1}`, 
  productStorage.innerText);
  total();
  loadingRemove();
};

document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('item__add')) {
    const id = event.target.parentNode.firstChild.innerText;
    searchId(id);
  }
});

function carCleaner() {
  carr.innerHTML = '';
  localStorage.clear();
}

const bttCarCleaner = (() => {
  const bttClear = document.querySelector('.empty-cart');
  bttClear.addEventListener('click', carCleaner);
});

window.onload = function onload() { 
  searchComputer();
  bttCarCleaner();
  total();
};