const cartItems = document.getElementsByClassName('cart__items');

const items = document.getElementsByClassName('items');

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

function createProductItemElement({ id, title, thumbnail }) {
  const imageAdjust = thumbnail.replace(/-I.jpg/g, '-O.jpg');
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(imageAdjust));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}
async function getAPI() {
  let response = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  response = await response.json();
  response = await response.results;
  response.forEach((computer) => { 
    items[0].appendChild(createProductItemElement(computer));
  });
}

function createPriceElements() {
  const sectionItems = document.getElementsByClassName('cart')[0];
  const divPrice = createCustomElement('div', 'total-price', '');
  sectionItems.appendChild(divPrice);
  const LabelPrice = createCustomElement('p', 'price-label', 'Preço total:');
  divPrice.appendChild(LabelPrice);
  const totalPrice = createCustomElement('p', 'price-div', 'Preço total:');
  divPrice.appendChild(totalPrice);
}

function calculatePrices() {
  const priceItem = document.getElementsByClassName('total-price')[0];
  const cartItem = document.querySelectorAll('.cart__item');
  priceItem.innerText = 0;
  let pricePrice = parseFloat(priceItem.innerText);
  cartItem.forEach((item) => {
    const precoTxt = item.innerText.split('$').pop();
    const precoNumber = Number(precoTxt);
    console.log(precoNumber);
    pricePrice += precoNumber;
  });
  priceItem.innerText = pricePrice;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
  calculatePrices();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function clickButton(event) {
  const itemID = event.target.parentElement.firstChild.innerText;
  let fetchComputer = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  fetchComputer = await fetchComputer.json();
  cartItems[0].appendChild(createCartItemElement(fetchComputer));
  localStorage.setItem('items', JSON.stringify(cartItems[0].innerHTML));
  calculatePrices();
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    clickButton(event);
  } else if (event.target.classList.contains('empty-cart')) {
    cartItems[0].innerHTML = '';
    localStorage.setItem('items', JSON.stringify(cartItems[0].innerHTML));
    calculatePrices();
  }
});

window.onload = function onload() { 
  getAPI();
  cartItems[0].innerHTML = JSON.parse(localStorage.getItem('items'));
  cartItems[0].childNodes.forEach((comp) => comp.addEventListener('click', cartItemClickListener));
  createPriceElements();
  calculatePrices();
};