const URL_ML = 'https://api.mercadolibre.com/sites/MLB/search'; 
const sectionItems = document.querySelector('.items');
const cartItem = document.querySelector('.cart__items');
const price = document.querySelector('.total-price');
const button = document.querySelector('.empty-cart');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function sumTotal() {
  const total = 0;
  let number = 0;
  if (cartItem.childNodes !== null) {
    cartItem.childNodes.forEach((element) => {
      number += parseFloat(element.innerText.split('$')[1]);
      price.innerText = total + number;
    });
    if (price.childNodes.lengt === 0) {
      price.innerText = 0;
    }
  }
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

function saveLocal() {
  const array = [];
  if (cartItem !== null) {
    cartItem.childNodes.forEach((element) => {
      array.push(element.innerText);
    });
    localStorage.setItem('array', JSON.stringify(array));
  }
}

function cartItemClickListener(event) {
  event.target.remove();
  saveLocal();
  sumTotal();
} 

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
} 

function addToCart(event) {
      const data = event.target.parentElement;
      const id = getSkuFromProductItem(data);
      fetch(`https://api.mercadolibre.com/items/${id}`)
      .then((response) => response.json())
      .then((product) => {
        const createCart = createCartItemElement(product);
        cartItem.appendChild(createCart);
        saveLocal();
        sumTotal();
    });
}
function fetchEcommerceAsync() {
  fetch(`${URL_ML}?q=$computador`)
    .then((response) => response.json())
    .then((products) => products.results.forEach((product) => {
     const createItem = createProductItemElement(product);
     sectionItems.appendChild(createItem);
      createItem.lastChild.addEventListener('click', addToCart);
  }));
}

function getCart() {
  const saveCart = JSON.parse(localStorage.getItem('array'));
  if (saveCart !== null) {
    saveCart.forEach((item) => {
      const li = document.createElement('li');
      li.className = 'cart__item';
      li.innerHTML = item;
      cartItem.appendChild(li);
      li.addEventListener('click', cartItemClickListener);
    });
  }
}

button.addEventListener('click', () => {
  price.innerText = '';
  cartItem.innerHTML = '';
  localStorage.removeItem('array');
});

window.onload = function onload() { 
  fetchEcommerceAsync();
  getCart();
  sumTotal();
};