const BASE_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
const BASE_URL_ITEM = 'https://api.mercadolibre.com/items/';

function cartItemClickListener(event) {
  event.target.remove();
}
// document.getElementById('myPc').innerHTML = localStorage.getItem('myPc');}
function addLocalStorage(sku, name, salePrice) {
  localStorage.setItem('myPc', sku, name, salePrice);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.addEventListener('click', cartItemClickListener);
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener); // Ativida 3
  ol.appendChild(li);
}

async function fetchIdJson(event) {
  const idTarget = event.target.classList[1];
  // console.log(idTarget);
  try {
  let fetchId = await fetch(`${BASE_URL_ITEM}${idTarget}`);
  fetchId = await fetchId.json();
  console.log(fetchId);
  createCartItemElement(fetchId);
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

// Ativida 1 FEITO
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
// Ativida 1 FEITO

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// Ativida 3

// Ativida 3

// Ativida 2

// Ativida 2

async function fetchComputerAsync(search) {
  try {
  let results = await fetch(`${BASE_URL}${search}`);
  results = await results.json();
  results = await results.results;
  // console.log(results);
  await results.forEach((computador) => createProductItemElement(computador));
} catch (error) {
    console.log('Deu errado o FETCH');
  }
}

function emptyList() {
  const emptyBttn = document.querySelector('.empty-cart');
  const ol = document.querySelector('.cart__items');
  emptyBttn.addEventListener('click', () => {
  ol.replaceChildren('');
  });
}

window.onload = function onload() { 
  fetchComputerAsync('computador');
  emptyList();
};
