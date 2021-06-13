const URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const listCart = document.querySelector('cart_items');

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
// RESOLVER PROBLEMA DE ASSINCRONICIDADE
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
    // coloque seu código aqui
  return event;
  }

function createCartItemElement({ id: sku, title: name, sale: salePrice }) {
const li = document.createElement('li');
li.className = 'cart__item';
li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
li.addEventListener('click', cartItemClickListener);
return li;
}

const getProductId = async (event) => {
  const getEvent = event.target.parentElement;
  const itemID = getSkuFromProductItem(getEvent);

    await fetch(`https://api.mercadolibre.com/items/${itemID}`)
    .then((response) => response.json())
    .then((productId) => listCart.appendChild(createCartItemElement(productId)))
    .catch(() => console.log('error'));
}; 

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
//   const itemContent = document.querySelector('.items')[0];
//   produtos.forEach((item) => {
//     itemContent.appendChild(createProductItemElement(item));
//   });
// };

// função que adiciona os produtos as <sections> criadas na createProductItemElement().
const fetchItem = async () => { // extrai o array de elementos do arquivo jason e manda pra a função getProductAddElement().
  const itemContent = document.querySelector('.items');
  fetch(URL)
  .then((response) => response.json())
  .then((produtos) => produtos.results.forEach((item) => {
    itemContent.appendChild(createProductItemElement(item));
  }));
};

// ------------------------------------------------------------------- part 2

window.onload = function onload() {
  fetchItem();
};