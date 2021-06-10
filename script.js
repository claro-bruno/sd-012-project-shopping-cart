const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const section = document.querySelector('.items');
const ol = document.querySelector('.cart__items');

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

function createProductItemElement({id: sku, title: name, thumbnail: image }) {
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
  ol.removeChild(event.target);
}

function createCartItemElement({id: sku, title: name, price :salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//exercicio 1
const fetchM = () => {  
  fetch(API_URL).then((response) => response.json())
  .then((e) => e.results.forEach((key) => section.appendChild(createProductItemElement(key))));
}

//exercicio 2
const fetchID = async (id) => {
  const response = fetch(`https://api.mercadolibre.com/items/${id}`);
  const idD = response.json();
   ol.appendChild(createCartItemElement(idD));
};

const buttonCart = () => {
  const addButtonCart = document.querySelectorAll('.item__add');
  console.log(addButtonCart);
  addButtonCart.forEach((button) => {
    button.addEventListener('click', () => { 
      const id = getSkuFromProductItem(button.parentNode);
      fetchID(id);
   });
  });
};

const removeItem = () => {

}

window.onload = function onload() {
  fetchM()
  };