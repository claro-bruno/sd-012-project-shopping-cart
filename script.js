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

// Adiciona produtos ao carrinho e remove produtos do carrinho e Local Storage (Mentoria - Márcio Daniel )
function addToLocalStorage() {
  const takeLi = document.querySelector('.cart__items').innerHTML;
  localStorage.setItem('product', takeLi);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Soma o preço total dos itens presentes no carrinho (Mentoria - Márcio Daniel)
function sum() {
  const takeAllLisByClass = document.querySelectorAll('.cart__item');
  let acumulador = 0;
  takeAllLisByClass.forEach((li) => {
    const takePrice = li.innerText.split('$')[1];
    acumulador += parseFloat(takePrice);
  });
  return acumulador;
}

function showTotalPrice() {
  const takeSpanPrice = document.querySelector('#price');
  takeSpanPrice.innerText = sum();
  localStorage.setItem('price', takeSpanPrice.innerText);
  
  const takePriceFromLocalStorage = localStorage.getItem('price');
  
  if (takePriceFromLocalStorage) {
    takeSpanPrice.innerText = takePriceFromLocalStorage;
  }
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  addToLocalStorage();
  showTotalPrice();
}

// Renderiza na tela o carrinho com os produtos do Local Storage e devolve evento de clique às Lis (Mentoria - Gisele Santin)
function verifyLocalStorage() {
  const takeFromLocalStorage = localStorage.getItem('product');
  if (takeFromLocalStorage) {
    takeOlCartItem.innerHTML = takeFromLocalStorage;
  }
  const takeLiAgain = takeOlCartItem.children;
  Array.from(takeLiAgain).forEach((li) => {
    li.addEventListener('click', cartItemClickListener);
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// Esvazia o carrinho de compras e o Local Storage
function emptyCart() {
  const takeEmptyCartButton = document.querySelector('.empty-cart');
  const takeSpanPrice = document.querySelector('#price');

  takeEmptyCartButton.addEventListener('click', () => {
    takeOlCartItem.innerText = '';
    localStorage.clear();
    takeSpanPrice.innerText = 0;
  });
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

          addToLocalStorage();
          showTotalPrice();
        });
    });
  });
}

window.onload = function onload() {
  takeProductsFromApi()
    .then(() => takeProductButtons());

  verifyLocalStorage();
  showTotalPrice();
  emptyCart();
};
