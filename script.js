const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const ol = document.querySelector('.cart__items');
const loading = document.querySelector('.loading');
const total = document.querySelector('.total-price');

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
  ol.removeChild(event.target);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

//exercicio 1
const fetchM = async () => {  
  showLoading()
  const itens = document.querySelector('.items');
  const response = await fetch(API_URL);
  const obj = await response.json();
  const result = obj.results;
  result.forEach((computer) => {
    itens.appendChild(createProductItemElement(computer));
  })
  hidingLoading()
}

//exercicio 2
const fetchID = async (id) => {
  const response = await fetch(`https://api.mercadolibre.com/items/${id}`);
  const idD = await response.json();
   ol.appendChild(createCartItemElement(idD));
 
};

const buttonCart = () => {
  const addButtonCart = document.querySelectorAll('.item__add');
  addButtonCart.forEach((button) => {
    button.addEventListener('click', () => { 
      const id = getSkuFromProductItem(button.parentNode);
      fetchID(id)
      .then((item) => ol
      .appendChild(createCartItemElement(item)))
      .then(() => saveStorage());
   });
  });
};

const saveStorage = () => {
  localStorage.setItem('cart', ol.innerHTML)
  document.addEventListener('click', () => saveStorage());
}

const loadStorage = () => {
  localStorage.getItem('cart');
}

const removeItem = () => {

}

const clearShop = () => {
  const clearButtonCart = document.querySelector('.empty-cart');
  clearButtonCart.addEventListener('click', () => {
    ol.innerHTML = ' ';
  });
};

const showLoading = () => {
  loading.classList.add("display");
}

const hidingLoading = () => {
  loading.classList.remove("display");
}

window.onload = function onload() {
  fetchM()
  .then(() => buttonCart());
  .then(() => clearShop());
  .then(() => loadStorage());
  };