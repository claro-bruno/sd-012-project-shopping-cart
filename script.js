const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const listCart = document.querySelector('.cart__items');
const cart = document.querySelector('.cart');

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const price = document.querySelector('.price');
const createTotal = document.createElement('span');
createTotal.className = 'total-price';
price.appendChild(createTotal);

function sum() {
  let total = 0;
  listCart.childNodes.forEach((element) => {
    total += parseFloat(element.innerText.split('$')[1]);
  });
  createTotal.innerText = total;
}

// função que pega o elemento do evento do click e o remove.
function cartItemClickListener(event) {
  const item = event.target;
  listCart.removeChild(item);
  sum();
  }

// remove os elementos filhos ao clicar no botão.
const esvaziarCarrinho = document.querySelector('.empty-cart');
esvaziarCarrinho.addEventListener('click', () => {
    listCart.innerHTML = '';
    sum();
  });

// função que cria as li do carrinho de compras.
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
const li = document.createElement('li');
li.className = 'cart__item';
li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
li.addEventListener('click', cartItemClickListener);
return li;
}

// função que adiciona o produto pego na função getProductId() ao carrinho utilizando a função createCartItemElement();
function addProductToCar(element) {
  listCart.appendChild(createCartItemElement(element));
  sum();
}

function getProductId(event) {
  const origin = event.target.parentElement;
  const id = getSkuFromProductItem(origin);

    fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((product) => addProductToCar(product));
  } 

function createProductItemElement({ id: sku, title: name, thumbnail: image }) { // reatrubuí os valores
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'))
  .addEventListener('click', getProductId);
  return section;
}

// função que coleta as informações sobre os produtos e adiciona as <sections> criadas na createProductItemElement().
const fetchItems = () => { // extrai o array de elementos do arquivo jason e manda pra a função getProductAddElement().
  const loading = document.createElement('p');
  loading.innerHTML = 'Procurando...';
  loading.className = 'loading';
  
  const itemContent = document.querySelector('.items');
  cart.appendChild(loading);
  fetch(URL)
  .then((response) => response.json())
  .then((produtos) => {
    cart.removeChild(loading);
    produtos.results.forEach((item) => {
    itemContent.appendChild(createProductItemElement(item));
  });
});
};

window.onload = function onload() {
  fetchItems();
};