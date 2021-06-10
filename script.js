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
  const imagemMelhor = image.replace(/-I.jpg/g, '-O.jpg');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(imagemMelhor));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

const setLocalStorage = () => {
  const cartItems = document.getElementsByClassName('cart__items');
  localStorage.setItem('item', cartItems[0].innerHTML);
};

function createPriceDiv() {
  const cart = document.getElementsByClassName('cart')[0];
  const priceDiv = createCustomElement('div', 'total-price', '0');
  cart.appendChild(priceDiv);
}

function calculatePrices() {
  const priceDiv = document.getElementsByClassName('total-price')[0];
  const itemList = document.querySelectorAll('.cart__item');
  priceDiv.innerText = 0;
  let onlyNymber = parseFloat(priceDiv.innerText);
  itemList.forEach((e) => {
    const precoTxt = e.innerText.split('$').pop();
    const precoNumber = Number(precoTxt);
    onlyNymber += precoNumber;
  });
  priceDiv.innerText = onlyNymber;
}

function cartItemClickListener(event) {
  event.target.remove();
  setLocalStorage();
  calculatePrices();
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const items = document.getElementsByClassName('items');
const loadingButton = document.getElementsByClassName('loading');

const FreeMarket = async () => {
  let endpoint = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  endpoint = await endpoint.json();
  endpoint = await endpoint.results;
  endpoint.forEach((element) => {
    items[0].appendChild(createProductItemElement(element));
  });
  loadingButton[0].remove();
};

const cart = document.getElementsByClassName('cart__items');

const selectComputer = async (event) => {
  let endpoint = await fetch(`https://api.mercadolibre.com/items/${event}`);
  endpoint = await endpoint.json();
  cart[0].appendChild(createCartItemElement(endpoint));
  setLocalStorage();
  calculatePrices();
};

const emptyCartItems = () => {
  const emptyButton = document.querySelector('.cart__items');
  emptyButton.innerHTML = '';
  calculatePrices();
};

document.addEventListener('click', (event) => {
  if (event.target.classList.contains('item__add')) {
    const IdItem = event.target.parentElement.firstChild.innerText;
    selectComputer(IdItem);
  } else if (event.target.classList.contains('empty-cart')) {
    emptyCartItems();
  }
});

window.onload = function onload() { 
  FreeMarket();
  cart[0].innerHTML = localStorage.getItem('item');
  cart[0].childNodes.forEach((e) => e.addEventListener('click', cartItemClickListener));
  createPriceDiv();
};
