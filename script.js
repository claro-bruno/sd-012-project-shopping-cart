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

// usado no requisito 3
function cartItemClickListener(event) {
  event.target.remove();
}
 
function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// usado no requisito 1
const API1_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function fetchApi1() {
  try {
    const response = await fetch(API1_URL);
    const { results } = await response.json();
    results.forEach((item) => createProductItemElement(item));
  } catch (error) { 
    alert('Algo deu errado!');
  }
}

// usado no requisito 2, para realizar o requisito 2 e 3 tive que consultar o repositório de alguns colegas como
// o da Marcela Silva, não copiei o código em si mas precisei da ajuda para terminar meu raciocínio
const cartItems = document.querySelector('.cart__items');

async function fetchAPIProduct(id) {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
    const product = await response.json();
    cartItems.appendChild(createCartItemElement(product));
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
  
window.onload = () => {
  fetchApi1();
};
