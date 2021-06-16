const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const listCart = document.querySelector('.cart__items');

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

function cartItemClickListener(event) {
  const item = event.target;
  listCart.removeChild(item);
  }

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
// // função que adiciona os produtos pego na fetchItem() aos elementos criados na createProductItemElement().
// const getProductAddElement = (produtos) => {
//   const itemContent = document.querySelector('.items');
//   produtos.forEach((item) => {
//     itemContent.appendChild(createProductItemElement(item));
//   });
// };

// função que adiciona os produtos as <sections> criadas na createProductItemElement().
const fetchItems = () => { // extrai o array de elementos do arquivo jason e manda pra a função getProductAddElement().
  const itemContent = document.querySelector('.items');
  fetch(URL)
  .then((response) => response.json())
  .then((produtos) => produtos.results.forEach((item) => {
    itemContent.appendChild(createProductItemElement(item));
  }));
};

// ------------------------------------------------------------------- part 2

window.onload = function onload() {
  fetchItems();
};