const MercadoLivreURL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const MLItemSearch = 'https://api.mercadolibre.com/items/';

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function loading() {
  const container = document.querySelector('.container');
  const loadingP = document.querySelector('.loading');
  console.log();
  if (!loadingP) {
    container.appendChild(createCustomElement('span', 'loading', 'loading...'));
  } else {
    container.removeChild(loadingP);
  }
}

async function getRequest(url) {
  loading();
  const response = fetch(url).then((r) => r.json())
  .catch((reject) => { throw new Error(`Could not find the url! ${reject.Error}`); });
  setTimeout(loading, 100);
  return response;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function adicionaTotal(price) {
  const total = document.querySelector('.total-price');
  if (!total.innerText) { 
    total.innerText = price; 
   } else total.innerText = price + parseFloat(total.innerText);
}

function cartItemClickListener(event) {
  event.srcElement.remove();
  let price = event.srcElement.innerText.toString().split('$');
  price = parseFloat(price[1]);
  adicionaTotal(price * (-1));
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

async function adicionaCarrinho(element, id) {
  const carrinho = document.querySelector('.cart__items');
  element.addEventListener('click', async function () {
    const item = await getRequest(MLItemSearch + id);
    carrinho.appendChild(createCartItemElement(item));
    adicionaTotal(item.price);
  });
}

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.className = 'item';
  adicionaCarrinho(button, id);

  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(button);

  return section;
}

async function adicionaItens() {
  const MLlista = await getRequest(MercadoLivreURL);
  const listaItens = [];
  const itemsSection = document.querySelector('.items');
  
  MLlista.results.forEach((result) => {
    listaItens.push(createProductItemElement(result));
  });
  listaItens.forEach((item) => {
    itemsSection.appendChild(item);
  });
}

function esvaziaCarrinho() {
  const carrinho = document.querySelector('.cart__items');
  const total = document.querySelector('.total-price');
  const emptyCart = document.querySelector('.empty-cart');
  
  emptyCart.addEventListener('click', () => {
    carrinho.innerHTML = '';
    total.innerText = '';
  });
}

window.onload = async function onload() { 
  adicionaItens();
  esvaziaCarrinho();
};