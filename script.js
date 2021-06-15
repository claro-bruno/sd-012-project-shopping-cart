const takeSectionItems = document.querySelector('.items');
const takeOlCartItem = document.querySelector('.cart__items');

// APIs
const PRODUCTS_API = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const PRODUCT_BY_ID = 'https://api.mercadolibre.com/items';

// Cria elementos HTML para renderizar os produtos da API
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
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// Adiciona/remove produtos ao carrinho
function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// function cartItemClickListener(event) {
//   // coloque seu código aqui
// }

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // li.addEventListener('click', cartItemClickListener);
  return li;
}

// Pega API do Mercado Livre e renderiza produtos na tela na tela (Mentoria - Ronald)
function takeProductsFromApi() {
  return new Promise((resolve) => {
    fetch(PRODUCTS_API)
      .then((response) => response.json())
      .then((secondResponse) => secondResponse.results)
      .then((products) => {
        products.forEach((product) => {
          takeSectionItems.appendChild(createProductItemElement(product));
        });
        resolve();
      });
    });
}

// Adiciona evento aos botões dos produtos (Mentoria - Jensen)
function takeProductButtons() {
  const takeButtons = document.querySelectorAll('.item__add');
  Array.from(takeButtons);
  takeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      const sku = getSkuFromProductItem(event.target.parentNode);
      
      fetch(`${PRODUCT_BY_ID}/${sku}`)
        .then((response) => response.json())
        .then((secondResponse) => {
          takeOlCartItem.appendChild(createCartItemElement(secondResponse));
        });
    });
  });
}

window.onload = function onload() {
  takeProductsFromApi()
    .then(() => takeProductButtons());
};
