const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function getItemPromise(item) {
  const result = fetch(`https://api.mercadolibre.com/items/${item}`) // Pega os itens de forma assíncrona
    .then((response) => response.json())
    .then((data) => data)
    .catch((erro) => console.log(erro));
  return result;
}
let shoppingCart = [];
  async function getTotalPrice() { // Reduzindo o objeto em um array
  const totalPrice = document.querySelector('.total-price');
  const total = shoppingCart.reduce((accumulator, currentItem) =>
  accumulator + Number(currentItem.split('$')[1]), 0);
  totalPrice.innerText = total;
  // totalPrice.innerText = (`R$:${total}`);
}

function localStorageUpdate() {
  localStorage.setItem('savedCart', JSON.stringify(shoppingCart));
  getTotalPrice();
}

// template 05
function cartItemClickListener(event) { // Eventos do Clicke do Carrinho
  const item = event.target;
  const xablauzinho = item.parentNode; // Retornando o elemento Pai 
  xablauzinho.removeChild(item);
  const productIndex = shoppingCart.findIndex((product) =>
  product === item.innerText); // 
  if (shoppingCart.length === 1) {
    shoppingCart.pop(); // 3 - Remove o item do carrinho de compras ao clicar nele
  } else {
    shoppingCart = shoppingCart.filter((xablau, xablau2) =>
    xablau2 !== productIndex);
  }
  localStorageUpdate();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  ol.appendChild(li);
  shoppingCart.push(li.innerText);
  return li;
}

async function starterShoppingCart(savedCart) {
  savedCart.forEach((item) => {
    const product = {
      id: item.split(' ')[1],
      title: item.split(' | ')[1].split(': ')[1],
      price: item.split(' | ')[2].split('$')[1],
    };

    createCartItemElement(product);
  });

  localStorageUpdate();
}
// Template function 1
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// Template function 2
function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}
// Template function 4
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

async function getItemToCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);

  const results = await getItemPromise(itemId);

  createCartItemElement(results);
  localStorageUpdate();
}
// Template function 3
function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const sectionItems = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  button.addEventListener('click', getItemToCart);
  section.appendChild(button);

  sectionItems.appendChild(section);

  return section;
}

async function getListItem() {
  const loader = document.createElement('div');
  loader.className = 'loading'; 
  document.querySelector('.items').appendChild(loader);
  const results = await fetch(url)
    .then((response) => response.json())  
    .then((data) => data)
    .catch((erro) => console.log(erro));

  document.querySelector('.items').removeChild(loader);
  results.results.map((result) => 
    createProductItemElement(result));
}

/*
async function getListItem() {  // Usando async
  const fechtResults = await fetch(url);
  const jsonApi = await fechtResults.json();
  const jonsonResults = await jsonApi.results;
  const itemList = document.querySelector('section.items');
  itemList.firstChild.remove();
  jonsonResults.forEach((item) => {
    itemList.appendChild(createProductItemElement(item));
  });
}
*/

function emptyCart() {
  shoppingCart = [];
  localStorageUpdate();
  document.querySelector('.cart__items').innerText = '';
}

window.onload = async () => {
try {
  const emptyBtn = await document.querySelector('.empty-cart');
  emptyBtn.addEventListener('click', emptyCart);

  if (localStorage.getItem('savedCart') && localStorage.getItem('savedCart') !== '') {
    const parse = JSON.parse(localStorage.getItem('savedCart')); // Esvaziando carrinho
    starterShoppingCart(parse);
  }
  getListItem();  
} catch (error) {
  console.log(error);
}
};