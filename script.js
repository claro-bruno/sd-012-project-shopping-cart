const BASE_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=';
console.log(BASE_URL);

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

const priceArray = [];

function getTotalPrice({ salePrice }) {
  priceArray.push(salePrice);
  const sumOfPrices = priceArray.reduce((acc, crr) => acc + crr, 0);
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = `${sumOfPrices}`;
}

const cartItems = 'cart__items';
function cartDeposit() {
  localStorage.setItem('shoppingCart',
  document.querySelector(`.${cartItems}`).innerHTML);
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

function clearCart() {
  const clearBtn = document.querySelector('.empty-cart');
  const cartOl = document.querySelector(`.${cartItems}`);
  clearBtn.addEventListener('click', () => {
    while (cartOl.firstChild) {
      cartOl.removeChild(cartOl.firstChild);
    }
    cartDeposit();
  });
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function cartItemClickListener(event) {
  event.target.remove();
  const priceToBeRemoved = Number(event.target.innerText.split('$')[1]);
  if (priceToBeRemoved > 0) {
    const newObj = { salePrice: -priceToBeRemoved };
    getTotalPrice(newObj);
  }
  cartDeposit();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
  .then((response) => response.json())
  .then((object) => {
    const newObj = {
      sku: object.id,
      name: object.title,
      salePrice: object.price,
    };
    
    const cartOl = document.querySelector(`.${cartItems}`);
      cartOl.appendChild(createCartItemElement(newObj));
      cartDeposit();
      getTotalPrice(newObj);
  });
}

function addToCart() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const idEvent = event.target.parentNode.firstElementChild.innerText;
      return addCart(idEvent);
    }
  });
}

const fechAPI = async () => {
  const load = document.querySelector('.loading');
  load.innerHTML = 'loading';
  fetch(`${BASE_URL}computador`);
  let obj = await fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  obj = await obj.json();
  const items = document.querySelector('.items');
  obj.results.forEach((item) => {
    items.appendChild(createProductItemElement(item));
  });
  load.remove();
};
  
window.onload = function onload() { 
  fechAPI();
  addToCart();
  cartDeposit();
  clearCart();
};