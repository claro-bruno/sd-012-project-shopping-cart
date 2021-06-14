const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
function getItemPromise(item) {     
  const result = fetch(`https://api.mercadolibre.com/items/${item}`) // Pega os itens de forma assíncrona
    
  .then((response) => response.json())
    .then((data) => data)
    .catch((erro) => console.log(erro));     
  return result;
}
/*
// template 06
function cartItemClickListener(event) { // 3 - Remova o item do carrinho de compras ao clicar nele
   
  }
*/
// template 07
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const ol = document.querySelector('.cart__items');
  const li = document.createElement('li');

  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  ol.appendChild(li); 

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
// LocalStorage
async function getItemToCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentNode);
  const results = await getItemPromise(itemId); // Aguarda de forma assincrona os itens do carrinho
  createCartItemElement(results); // Cria o Item do carrinho
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
  const loaderItem = document.createElement('createDivtem'); // Carrega os itens na tela
   document.querySelector('.items').appendChild(loaderItem);

  const results = await fetch(url)
    .then((response) => response.json())
    .then((data) => data)
    .catch((error) => console.log(error));

  document.querySelector('.items').removeChild(loaderItem);
  results.results.map((result) => createProductItemElement(result));
}

function emptyCart() {
document.querySelector('.cart__items').innerText = ''; // Itens do Carrinho
}

window.onload = function onload() {
  const emptyBtn = document.querySelector('.empty-cart');
  emptyBtn.addEventListener('click', emptyCart);

  if (localStorage.getItem('savedCart') && localStorage.getItem('savedCart') !== '') {
    const parse = JSON.parse(localStorage.getItem('savedCart'));
    starterShoppingCart(parse);
  }

  getListItem();
};