const BASE_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const BASE_URL_ITEM = 'https://api.mercadolibre.com/items/';
const somaT = document.createElement('div');

function loadCirclet(pai) {
  const circleDiv = document.createElement('div');
  circleDiv.className = '.loader';
  pai.appendChild(circleDiv);
  circleDiv.style.display = 'flex';
  // circleDiv.remove();
}
function removePrice(event) {
  const valorTo = document.querySelector('.total-price');
  const totalN = Number(valorTo.innerText);
  const valueRemove = event.target.innerText.split('$');
  valorTo.innerText = `${Math.round(((totalN) - (Number(valueRemove[1]))) * 100) / 100}`;
}

function cartItemClickListener(event) {
  event.target.remove();
  event.target.localStorage.removeItem();
}

 function somatoria(price) {
  const paiCart = document.querySelector('.cart');
  if (price === undefined) {
    somaT.className = 'total-price';
    paiCart.appendChild(somaT);
    somaT.innerText = 0;
  } else {
    const totalPrice = document.querySelector('.total-price');
    const lastSun = Number(totalPrice.innerText);
    totalPrice.innerText = `${Math.round(((price) + (lastSun)) * 100) / 100}`;
  }
  loadCirclet(paiCart);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.addEventListener('click', removePrice);
  li.addEventListener('click', cartItemClickListener);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  ol.appendChild(li);
}

async function fetchIdJson(event) {
  const idTarget = event.target.classList[1];
  console.log(idTarget);
  try {
  let fetchId = await fetch(`${BASE_URL_ITEM}${idTarget}`);
  fetchId = await fetchId.json();
  createCartItemElement(fetchId);
  somatoria(fetchId.price);
} catch (error) {
    console.log('Deu errado no fetch FetchIdJson');
  }
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

function addLocalStorage(event) {
  const localTarget = event.target.classList[1];
  localStorage.setItem('loading', localTarget);
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const classitems = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  const itemAdd = section.querySelector('.item__add');
  itemAdd.classList.add(sku);
  classitems.appendChild(section);
  itemAdd.addEventListener('click', fetchIdJson);
  itemAdd.addEventListener('click', addLocalStorage);
}

async function fetchComputerAsync(search) {
  try {
  let results = await fetch(`${BASE_URL}${search}`);
  results = await results.json();
  results = await results.results;
  await results.forEach((computador) => createProductItemElement(computador));
} catch (error) {
    console.log('Deu errado o FETCH');
  }
  // loadCirclet();
}
async function fetchLocal(addSession) {
  try {
  let fetchId = await fetch(`${BASE_URL_ITEM}${addSession}`);
  fetchId = await fetchId.json();
  createCartItemElement(fetchId);
  somatoria(fetchId.price);
} catch (error) {
    console.log('Deu errado no fetch FetchIdJson');
  }
  // loadCirclet();
}
function getLocalStorage() {
  const addSession = localStorage.getItem('loading');
  fetchLocal(addSession);
}

function emptyList() {
  const emptyBttn = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  // emptyBttn.addEventListener('click', () => localStorage.delete('loading'));
  emptyBttn.addEventListener('click', () => {
  ol.replaceChildren('');
  somaT.innerText = 0;
  });
  localStorage.clear();
}

window.onload = function onload() { 
  fetchComputerAsync('computador');
  emptyList();
  getLocalStorage();
  somatoria();
  // loadCirclet();
};
