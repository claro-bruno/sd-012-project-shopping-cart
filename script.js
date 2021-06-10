/* eslint-disable max-lines-per-function */
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

function createButton(element, className, id, innerText) {
  const e = document.createElement(element);
  e.id = id;
  e.className = className;  
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  const deleteProduct = event;
  deleteProduct.target.outerHTML = '';
  // abaixo teste que eu vi no código de outros alunos durante a mentoria
  // const cartItems = document.querySelector('.cart__items');
  // cartItems.removeChild(event.target);
}

function createCartItemElement({ id: sku = this.id }) {
  fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then((response) => response.json())
    .then((response) => {
      const name = response.title;
      const salePrice = response.price;

      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
      li.addEventListener('click', cartItemClickListener);
    
      const cartItems = document.querySelector('.cart__items');
      cartItems.appendChild(li);
      
      // saveProducts();
    }); 
}

/* function saveProducts() {
  const products = document.querySelectorAll('.cart__item');
  localStorage.setItem('products', products.innerHTML);
}

function returnsSaveProducts() {
  const products = document.querySelectorAll('.cart__item');
  if (localStorage.getItem('products') !== undefined) {
    products.innerHTML = localStorage.getItem('products');
  }
} */

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createButton('button', 'item__add', `${sku}`, 'Adicionar ao carrinho!'));

  const sectionItems = document.querySelector('.items');
  sectionItems.appendChild(section);

  const buttonItemAdd = document.querySelectorAll('.item__add');
    buttonItemAdd.forEach((btn) => btn.addEventListener('click', createCartItemElement));
}

/* function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
} */

const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';

async function fetchAPI() {
  try {
    const response = await fetch(API_URL);
    const { results } = await response.json();
    results.forEach((item) => createProductItemElement(item));
  } catch (error) { 
    alert('Ops, deu ruim');
  }
}

window.onload = function onload() { 
  fetchAPI();
  // returnsSaveProducts();
};
