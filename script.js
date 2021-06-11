let shoppingCart = [];

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

function createProductItemElement({ sku, name, image }) {
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
// REQUISITO 4.1 - Salva os itens do carrinho no Local Storage:
function localStorageCart() {
  localStorage.setItem('shopping-data', JSON.stringify(shoppingCart));
}
// REQUISITO 5: Função que soma os valores dos produtos selecionados:
// OBS: Consegui graças à ajuda dos plantões e de 2 alunos da turma 12.
function cartPrices() {
  const totalPrices = document.querySelector('.total-price');
  const cartList = [...document.querySelectorAll('.cart__item')];
  totalPrices.innerText = 0;
  const cartSum = cartList.reduce((acc, cv) => acc + Number(cv.innerText.split('PRICE: $')[1]), 0);
  totalPrices.innerText = cartSum;
}
// REQUISITO 3 - Remove do carrinho os itens clicados:
function cartItemClickListener(event) {
  event.target.remove();
  cartPrices();
  localStorageCart();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
// REQUISITO 7.1 - Função que adiciona a mensagem de loading na tela durante a requisição:
function addLoading() {
  const loading = createCustomElement('p', 'loading', 'Loading...');
  document.querySelector('.cart').appendChild(loading);
}
// REQUISITO 7.2 - Função que remove o loading na tela:
function removeLoading() {
  document.querySelector('.loading').remove();
}
// REQUISITO 2.2 - Adiciona o item clicado no carrinho:
function insertCartItem() {
  const cartItem = document.querySelector('.cart__items');
  cartItem.innerHTML = '';
  shoppingCart.forEach((item) => {
    const cartItemElement = createCartItemElement(item);
    cartItem.appendChild(cartItemElement);
  });
}
// REQUISITO 2.1 - Busca os detalhes do produto clicado para adicionar no carrinho:
async function addToCart(event) {
  const sku = getSkuFromProductItem(event.target.parentElement);
  addLoading();
  const response = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const { title, price } = await response.json();
  removeLoading();
  shoppingCart.push({ sku, name: title, salePrice: price });
  insertCartItem();
  cartPrices();
  localStorageCart();
}
// REQUISITO 4.2 - Resgata os itens do carrinho salvo no Local Storage:
function retrieveLocalStorage() {
  const dataToRetrieve = JSON.parse(localStorage.getItem('shopping-data'));
  if (dataToRetrieve) {
    shoppingCart = [...dataToRetrieve];
    insertCartItem();
    cartPrices();
  }
}
// REQUISITO 1 - Insere a lista de produtos na página:
async function productList() {
  const itemSection = document.querySelector('section .items');
  addLoading();
  const response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  const { results } = await response.json();
  removeLoading();
  results.forEach((product) => {
    const component = createProductItemElement({
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    });
    component.querySelector('button').addEventListener('click', addToCart);
    itemSection.appendChild(component);
  });
}
// REQUISITO 6 - Apaga os itens do carrinho ao clicar no botão:
function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', () => {
    document.querySelector('.cart__items').innerHTML = ' ';
    localStorage.clear();
    shoppingCart = [];
    document.querySelector('.total-price').innerHTML = ' ';
  });
}

window.onload = async function onload() {
  await productList();
  retrieveLocalStorage();
  clearCart();
};
