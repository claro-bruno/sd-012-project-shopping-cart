const api = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const searchID = 'https://api.mercadolibre.com/items/';
const catalog = document.querySelector('.items');
const cart = document.querySelector('.cart__items');
const totalPrice = document.querySelector('.total-price');

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

function subtract(productPrice) {
  const number1 = parseFloat(productPrice);
  const number2 = parseFloat(totalPrice.innerText);
  totalPrice.innerText = (number2 - number1).toFixed(2);
  localStorage.setItem('currentPrice', totalPrice.innerText);
}

function sum(productPrice) {
  const number1 = parseFloat(productPrice);
  const number2 = parseFloat(totalPrice.innerText);
  totalPrice.innerText = number1 + number2;
  console.log(totalPrice);
  localStorage.setItem('currentPrice', totalPrice.innerText);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  event.target.remove();
  const value = event.target.innerText.split('$')[1];
  subtract(value);
  localStorage.setItem('currentCart', cart.innerHTML);
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addToCart(event) {
  fetch(searchID + getSkuFromProductItem(event.target.parentNode))
  .then((convert) => convert.json())
  .then((converted) => cart.appendChild(createCartItemElement(converted)))
  .then((outros) => outros.innerText.split('$')[1])
  .then((value) => sum(value))
  .then(() => localStorage.setItem('currentCart', cart.innerHTML));
}

const addButton = document.getElementsByClassName('item__add');

function a() {
  for (let i = 0; i < addButton.length; i += 1) {
    addButton[i].addEventListener('click', addToCart); 
  } 
}



function addLoading() {
  catalog.appendChild(createCustomElement('span', 'loading', 'loading...'));
}

function removeLoading() {
  catalog.querySelector('.loading').remove();
}




window.onload = function onload() {
  addLoading()
  fetch(api)
  .then((convert) => convert.json())
  .then((converted) => converted.results)
  .then((test) => test.forEach((information) => {
    catalog.appendChild(createProductItemElement(information));
  }))
  .then(() => {
    a();
  })
  .then(() => {
    (localStorage.getItem('currentCart') === null) ? totalPrice.innerText = 0 : 
    cart.innerHTML = localStorage.getItem('currentCart'); })
  .then(() => {
    const cartProducts = document.getElementsByClassName('cart__item');
    for (let i = 0; i < cartProducts.length; i += 1) {
      cartProducts[i].addEventListener('click', cartItemClickListener);
    }
  })
  .then(() => {
    if(localStorage.getItem('currentPrice') !== null) {
     totalPrice.innerText = localStorage.getItem('currentPrice') 
    }
  })
  .then(() => removeLoading())
};

const emptyCart = document.querySelector('.empty-cart')

function clearCart() {
  while(cart.firstChild) {
    cart.removeChild(cart.lastChild)
  }
  totalPrice.innerText = 0
  localStorage.clear()
}

emptyCart.addEventListener('click', clearCart)
