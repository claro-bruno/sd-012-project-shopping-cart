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

const items = document.getElementsByClassName('items');

function createProductItemElement({ id, title, thumbnail }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  section.appendChild(createCustomElement('span', 'item__sku', id));
  section.appendChild(createCustomElement('span', 'item__title', title));
  section.appendChild(createProductImageElement(thumbnail));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  
  return section;
}
async function pegaAPI() {
  let resposta = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  resposta = await resposta.json();
  resposta = await resposta.results;
  resposta.forEach((computador) => { 
    items[0].appendChild(createProductItemElement(computador));
  });
}

pegaAPI();

const cartItems = document.getElementsByClassName('cart__items');

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function createCartItemElement({ id, title, price }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${id} | NAME: ${title} | PRICE: $${price}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

async function botaoDeClick(event) {
  const itemID = event.target.parentElement.firstChild.innerText;
  let botaoFetch = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
  botaoFetch = await botaoFetch.json();
  cartItems[0].appendChild(createCartItemElement(botaoFetch));
  localStorage.setItem('items', JSON.stringify(cartItems[0].innerHTML));
}

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    botaoDeClick(event);
  }
});

window.onload = function onload() { 
  pegaAPI();
  cartItems[0].innerHTML = localStorage.getItem('items');
};