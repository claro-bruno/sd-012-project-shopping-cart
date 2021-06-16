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

// LocalStorage - setItem:
function localStorageSetItems() {
  // - Capturar a ol;
  const ol = document.querySelector('ol');
  // - Criar a função setItem para salvar o que é necessário; (Toda vez que houver um clique no add ao carrinho e toda vez que excluir algum produto ou esvaziar o carrinho)
  localStorage.setItem('ol', ol.innerHTML);
}

function cartItemClickListener(event) {
  const cartItems = document.querySelector('.cart__items');
  cartItems.removeChild(event.target);
  localStorageSetItems();
}
// LocalStorage - getItem:
// - Criar a função de getItem para pegar o que foi salvo; (será executado na função que constrói a li);
const localStorageGetItems = () => {
  const ol = document.querySelector('.cart__items');
  ol.innerHTML = localStorage.getItem('ol');
  const cartItems = Object.values(document.getElementsByClassName('cart__item'));
  cartItems.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
  });
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  document.querySelector('ol').appendChild(li);
  localStorageSetItems();
}

const addCart = (sku) => {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((product) => createCartItemElement(product));
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const button = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  section.appendChild(button); // feito com a ajuda e sugestão do colega Tiago Ornelas
  button.addEventListener('click', (event) => {
    addCart(event.target.parentNode.firstChild.innerText);
  }); // feito com a ajuda e sugestão do colega Tiago Ornelas

  return section;
}

const appendProducts = (products) => {
  const item = document.querySelector('.items');
  products.forEach((product) => {
    const section = createProductItemElement(product);
    item.appendChild(section);
  });
};

const fetchProducts = async () => {
  await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((response) => response.json())
    .then((products) => appendProducts(products.results));
    const loading = document.querySelector('.loading');
    loading.remove();
};

const clearCart = () => {
  const ol = document.querySelector('ol');
  const clearCartButton = document.querySelector('.empty-cart');
  clearCartButton.addEventListener('click', () => {
  // console.log('clicado'); // Botão está ok, testado!
    // while (ol.hasChildNodes()) {
    //   ol.removeChild(ol.firstChild);
    // } ESTA FOI A FORMA USADA PARA FAZER NO PROJETO TODOLIST, TAMBÉM FUNCIONA! PORÉM VOU DEIXAR UMA FORMA DIFERENTE.
  const allCartItems = document.querySelectorAll('.cart__item');
  allCartItems.forEach((product) => ol.removeChild(product));
  localStorageSetItems();
  });
};
clearCart();

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

window.onload = function onload() {
  fetchProducts();
  localStorageGetItems();
};

// Falta refatorar e limpar o código, padronizar as funções utilizadas (algumas vezes foram utilizadas funções anônimas e outras arrow functions)
