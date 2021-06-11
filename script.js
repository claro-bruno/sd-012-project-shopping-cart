const apiMercadoLivre = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

const listCart = document.querySelector('.cart__items');
const ol = document.querySelector('.cart__items');
const body = document.querySelector('body');
const totalResult = document.querySelector('.total-price');

// 5 requisito abaixo ----------------------------------------------------------

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

// 7 requisito abaixo----------------------------------------------------------

const loading = createCustomElement('section', 'loading', 'loading...');
const loadingAppear = () => {  
  body.appendChild(loading);
};
console.log(loading);

const loadingDesapear = () => {
  if (loading) body.removeChild(loading);
};

// const loadingCall = () => {
//   const loading = document.querySelector('.loading');
//   loading.remove();
// }

// ---------------------------------------------------------------------------

// colocando "id: sku" estamos fazendo destruction do parâmetro
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

// 5 requisito abaixo ----------------------------------------------------------

const currentPrice = () => {
  totalResult.innerText = 0;
};

const totalPrices = () => {
  const prices = listCart.childNodes; // pega todas as "li" da "ol"
  console.log(prices);
  const regExp = /\d*\.?\d*$/;
  let result = 0;
  prices.forEach((value) => { // esse descontrução pega 
    result += parseFloat(value.innerHTML.match(regExp));
  });
  totalResult.innerHTML = result;
};

// 4 requisito abaixo e na função onload ---------------------------------------

const saveLocalStorage = () => {
  localStorage.setItem('myCart', listCart.innerHTML);
};

// 3 requisito abaixo----------------------------------------------------------

function cartItemClickListener(event) {
  event.target.remove();
  saveLocalStorage();
  totalPrices();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function loadLocalStorage() {
  listCart.innerHTML = localStorage.getItem('myCart');
  const teste = document.querySelectorAll('.cart__item');
  teste.forEach((li) => li.addEventListener('click', cartItemClickListener));
  totalPrices();
}

currentPrice();

// 2 requisito abaixo ----------------------------------------------------------

const addItens = async (id) => {  
  let idItem = await fetch(`https://api.mercadolibre.com/items/${id}`);
  idItem = await idItem.json();
  // console.log(idItem.price);
  // const ol = document.querySelector('.cart__items');
  ol.appendChild(createCartItemElement(idItem));
  saveLocalStorage();
  totalPrices();
};

const addCart = () => {
  const btnAdd = document.querySelectorAll('.item__add');
btnAdd.forEach((button) => {
  button.addEventListener('click', (event) => {
    const getId = getSkuFromProductItem(event.target.parentNode); // para pegar o id    
    addItens(getId);    
  });
});
};

// const addCart = () => {
//   const btnAdd = document.querySelectorAll('.item__add');
// btnAdd.forEach((button) => {
//   button.addEventListener('click', (event) => {
//     const getId = event.target.parentElement.firstChild.innerText; // para pegar o id    
//     addItens(getId);    
//   });
// });
// };

// 1 requisito abaixo ----------------------------------------------------------

const fetchML = async () => {
  loadingAppear();
  const itens = document.querySelector('.items');
  const response = await fetch(apiMercadoLivre);
  const apiJson = await response.json();
  const array = await apiJson.results;
  await array.forEach((item) => itens.appendChild(createProductItemElement(item)));
  addCart();
  loadingDesapear();  
};

// const fetchML = () => {
//   loadingAppear();
//   const itens = document.querySelector('.items');
//   fetch(apiMercadoLivre)
//   .then((response) => response.json())
//   .then((response) => response.results)
//   .then((arr) => arr.forEach((item) => itens.appendChild(createProductItemElement(item))))
//   .then(() => addCart())
//   .then(() => loadingDesapear());
// };

const emptyCart = document.querySelector('.empty-cart');

const turnEmptyCart = () => {
  emptyCart.addEventListener('click', () => {
    ol.innerHTML = '';
  });
};
turnEmptyCart();

window.onload = function onload() {
  fetchML();
  loadLocalStorage();  
 };
