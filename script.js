const listaCarrinho = document.querySelector('.cart__items');
const loading = document.querySelector('.containerLoading');
const valorTotal = document.querySelector('.total-price');

function calcularpreco() {
  const regex = /\d+\.?\d{1,2}$/;
  const xablau = listaCarrinho.childNodes;
  let precoDoCarrinho = 0;
xablau.forEach(({ innerHTML }) => {
  precoDoCarrinho += parseFloat(innerHTML.match(regex));
});
valorTotal.innerHTML = precoDoCarrinho;
}

function addLoading() {
  loading.innerHTML = '<p class="loading">loading...</p>';
}
function offLoading() {
  loading.innerHTML = '';
}

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

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  listaCarrinho.removeChild(event.target);
  localStorage.setItem('carrinhodecompras', listaCarrinho.innerHTML);
  calcularpreco();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} 

function apagaTudo() {
  listaCarrinho.innerHTML = '';
  localStorage.setItem('carrinhodecompras', listaCarrinho.innerHTML);
  valorTotal.innerHTML = 0;
}

function click() {
  const botoes = document.querySelectorAll('.item__add');
  botoes.forEach((botao) => {
    const IdName = getSkuFromProductItem(botao.parentNode);   
    botao.addEventListener('click', () => {
      addLoading();
      fetch(`https://api.mercadolibre.com/items/${IdName}`)
      .then((response) => response.json())
      .then((product) => listaCarrinho.appendChild(createCartItemElement(product)))
      .then(() => calcularpreco())
      .then(() => offLoading())
      .then(() => localStorage.setItem('carrinhodecompras', listaCarrinho.innerHTML));
    });
  });
}

function loadItemCart() {
  const storageitem = localStorage.getItem('carrinhodecompras');
  if (storageitem) {
    listaCarrinho.innerHTML = storageitem;
    
    listaCarrinho.childNodes
    .forEach((item) => {
      item.addEventListener('click', cartItemClickListener);
    });
  }
}

window.onload = function onload() {
  const sectionItem = document.querySelector('.items');
  loadItemCart();
  calcularpreco();
  
  addLoading();
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=$computador')
  .then((response) => (response.json()))
  .then((promise) => (promise.results))
  .then((array) => {
    array.forEach((dados) => {
      sectionItem.appendChild(createProductItemElement(dados));
    });
  })
  .then(() => offLoading())
  .then(() => click());
  const botaoApaga = document.querySelector('.empty-cart');
  botaoApaga.addEventListener('click', apagaTudo);
};
