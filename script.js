const BASE_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const BASE_URL_ITEM = 'https://api.mercadolibre.com/items/';
const somaT = document.createElement('div');
const ol = document.querySelector('.cart__items');
const emptyBttn = document.querySelector('.empty-cart');

function removePrice(event) {
  const valorTo = document.querySelector('.total-price');
  const totalN = Number(valorTo.innerText);
  const valueRemove = event.target.innerText.split('$');
  valorTo.innerText = `${Math.round(((totalN) - (Number(valueRemove[1]))) * 100) / 100}`;
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
  // loadCirclet(paiCart);
}

function addLocalStorage() {
  // const x = document.querySelector('.total-price'); 
  localStorage.setItem('loading', ol.innerHTML);
  // localStorage.setItem('total', x.innerHTML);Refatorar esta linha para desbugar
}

function cartItemClickListener(event) {
  event.target.remove();
  addLocalStorage();
  // event.target.localStorage.removeItem();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  // const ol = document.querySelector('.cart__items');
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
  addLocalStorage();
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
  // itemAdd.addEventListener('click', addLocalStorage);
}
// Cria 50 elementos

async function fetchComputerAsync(search) {
  const carregar = document.createElement('div');
  carregar.innerText = 'ESPERA CARREGAR ESSA BAGAÇA';
  carregar.className = 'loading';
  const paCart = document.querySelector('.cart');
  paCart.appendChild(carregar);
  try {
  let results = await fetch(`${BASE_URL}${search}`);
  results = await results.json();
  results = await results.results;
  await results.forEach((computador) => createProductItemElement(computador));
} catch (error) {
    console.log('Deu errado o FETCH');
  }
  carregar.remove();
}
// Cria 50 elementos

// async function fetchLocal(addSession) {
//   try {
//   let fetchId = await fetch(`${BASE_URL_ITEM}${addSession}`);
//   fetchId = await fetchId.json();
//   // createCartItemElement(fetchId);
//   somatoria(fetchId.price);
// } catch (error) {
//     console.log('Deu errado no fetch FetchIdJson');
//   }
//   // loadCirclet();
// }

function getLocalStorage() {
  // const y = document.querySelector('.total-price');
  ol.innerHTML = localStorage.getItem('loading') ? localStorage.getItem('loading') : '';
  // y.innerHTML = localStorage.getItem('total') ? localStorage.getItem('total') : '0';Refatorar esta linha para desbugar
}

// function emptyList() {  
//   // const ol = document.querySelector('.cart__items');
//   // emptyBttn.addEventListener('click', () => localStorage.delete('loading'));
 
// }

window.onload = function onload() { 
  fetchComputerAsync('computador');
  // emptyList();c
  getLocalStorage();
  somatoria();
  console.log(ol.children);
  [...ol.children].forEach((el) => {
    el.addEventListener('click', removePrice);
    el.addEventListener('click', cartItemClickListener);
  });
  // loadCirclet();
    emptyBttn.addEventListener('click', () => {
    ol.replaceChildren('');
    somaT.innerText = 0;
    localStorage.clear();
  });
};
