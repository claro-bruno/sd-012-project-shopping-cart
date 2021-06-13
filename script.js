const cartItems = document.querySelector('.cart__items');

// usado no requisito 1
function createProductImageElement(imageSource) {
 const img = document.createElement('img');
 img.className = 'item__image';
 img.src = imageSource;
 return img;
 }

 // usado no requisito 1
function createCustomElement(element, className, innerText) {
 const e = document.createElement(element);
 e.className = className;
 e.innerText = innerText;
 return e;
 }

// Requisito 1, fiz baseado na mentoria do Isaac

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);
  }
  
// function getSkuFromProductItem(item) {
// return item.querySelector('span.item__sku').innerText;
// }

// requisito 4
// usei : https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/setItem
// https://developer.mozilla.org/pt-BR/docs/Web/API/Storage/getItem mas só soube que teria q usar o set e o get 
//  no localStorage, depois que consultei repositório de colegas e tive ajuda do colega Igor Fernandes 
const atLocalStorage = () => {
  const cart = cartItems.innerHTML;
  localStorage.setItem('cart', cart);
};

const getLocalStorage = () => {
  const getItem = localStorage.getItem('cart');
  cartItems.innerHTML = getItem;
};

// usado no requisito 3 e 4
function cartItemClickListener(event) {
  event.target.remove();
  atLocalStorage();
}
 
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// requisito 7
// para finalizar o requisito utilizando o .remove(), consultei o repositório da Camila Malves, 
// que postou uma dúvida no slack
function loadingAppear() {
  const loading = document.querySelector('.loading');
  loading.remove();
}

// usado no requisito 1
const API1_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function fetchApi1() {
  try {
    const response = await fetch(API1_URL);
    const { results } = await response.json();
    results.forEach((item) => createProductItemElement(item));
    loadingAppear();
  } catch (error) { 
    alert('Algo deu errado!');
  }
}

// usado no requisito 2 e 4
// para realizar o requisito 2 e 3 tive que consultar o repositório de alguns colegas como
// o da Marcela Silva, não copiei o código em si mas precisei da ajuda para terminar meu raciocínio
async function fetchAPIProduct(id) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const product = await response.json();
    cartItems.appendChild(createCartItemElement(product));
    atLocalStorage();
  } catch (error) { 
    alert('Atenção, algo deu errado!');
  }
}

document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('item__add')) {
    const id = event.target.parentNode.firstChild.innerText;
    fetchAPIProduct(id);
  }
});

// uusado no requisito 6
// mentoria do Isaac casa de cambio, ajudou nessa parte
const removeItems = () => {
  cartItems.innerHTML = '';
};
 
window.onload = () => {
  fetchApi1();
  getLocalStorage();

  const clearButton = document.querySelector('.empty-cart');
  clearButton.addEventListener('click', removeItems);
};
