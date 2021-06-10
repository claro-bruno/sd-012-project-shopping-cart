const cartItem = '.cart__items';
const totalPrice = '.total-price';

const showZeros = () => {
  const totalValue = document.querySelector(totalPrice).innerText;
  const zeros = document.querySelector('.zeros');
  zeros.innerText = '';
  let stZeros = Math.abs(3 - (totalValue.length - totalValue.indexOf('.')));
  stZeros = (new Array(stZeros).fill(0)).join('');
  if ((totalValue.indexOf('.') === -1) && (totalValue !== '')) {
    zeros.innerText = `.${stZeros}`;
  } else { zeros.innerText = totalValue !== '' ? stZeros : ''; }
};

const showPriceInfo = () => {
  const totalValue = document.querySelector(totalPrice).innerText;
  const coin = document.querySelector('.coin');
  const text = document.querySelector('.totalText');  
  coin.innerText = (totalValue !== '') ? '$ ' : '';
  text.innerText = (totalValue !== '') ? 'TOTAL' : '';
  showZeros();
};

const loadingDiv = () => {
  if (document.querySelector('.loading') === null) {
    const div = document.createElement('div');
    div.className = 'loading';
    div.innerText = 'LOADING...';
    document.querySelector('.items').appendChild(div);
  } else {
    document.querySelector('.loading').remove();     
  }
};

const appendPrice = (price) => {
  const totalPricePlace = document.querySelector(totalPrice);
  let value = Math.round((Number(totalPricePlace.innerText) + Number(price)) * 100) / 100;
  value = value === 0 ? '' : value;
  totalPricePlace.innerText = value;
  showPriceInfo();  
  };

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

function createProductItemElement(sku, name, image, itemsSection) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image.replace('I.jpg', 'O.jpg')));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  itemsSection.appendChild(section);
}

function cartItemClickListener(event) {
  if (event.target.className === 'cart__item') {
    let priceStr = event.target.innerText;
    priceStr = `-${priceStr.slice(priceStr.indexOf('$') - priceStr.length + 1)}`;
    event.target.remove();
    appendPrice(priceStr);
    localStorage.setItem('shop', document.querySelector(cartItem).innerHTML);
    localStorage.setItem('totalValue', document.querySelector(totalPrice).innerHTML);
  }
}

function createCartItemElement(sku, name, salePrice, image) {
  const cartSection = document.querySelector(cartItem);
  const li = document.createElement('li');
  const img = document.createElement('img');
  img.src = image;
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.appendChild(img);
  cartSection.appendChild(li);
}

const getItems = async (QUERY, itemsSection) => {
  loadingDiv();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`)
  .then((indexResponse) => indexResponse.json().then((response) =>
  response.results.forEach((element) =>
  createProductItemElement(element.id, element.title, element.thumbnail, itemsSection)))
  .then(loadingDiv));
};

const addCartItem = (event) => {
  if (event.target.tagName === 'BUTTON') {
    const cartSec = document.querySelector(cartItem);
    const item = event.target.parentElement.children[0].innerText;
    fetch(`https://api.mercadolibre.com/items/${item}`)
    .then((indexResponse) => indexResponse.json().then((response) => {
      createCartItemElement(response.id, response.title, response.price, response.thumbnail);
      appendPrice(response.price);
      localStorage.setItem('shop', cartSec.innerHTML);
      localStorage.setItem('totalValue', document.querySelector(totalPrice).innerHTML);      
    }));
  }
};

const emptyCart = () => {
  localStorage.clear();
  document.querySelector(cartItem).innerHTML = '';
  document.querySelector(totalPrice).innerHTML = '';
  showPriceInfo();
};

  window.onload = function onload() { 
// Iniciando códigos para a Seção HTML do carrinho de Compras
  const cartSection = document.querySelector(cartItem);
  if (localStorage.getItem('shop')) {
    cartSection.innerHTML = localStorage.getItem('shop');
    document.querySelector(totalPrice).innerHTML = localStorage.getItem('totalValue');
    showPriceInfo();
  } 
  cartSection.addEventListener('click', cartItemClickListener);
// Iniciando códigos para a Seção HTML de seleção de itens
  const itemsSection = document.querySelector('.items');
  getItems('computador', itemsSection);
  itemsSection.addEventListener('click', addCartItem);  
// Botão de esvaziar carrinho de compra
  const emptyCartBtn = document.querySelector('.empty-cart');
  emptyCartBtn.addEventListener('click', emptyCart);
};
