const cartItems = '.cart__items';
const sumOfPrices = '.total-price';

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

// ------------------------------------------------------------------------------

let priceArray = [];

function getTotalPrice({ salePrice }) {
  const totalPrice = document.querySelector(sumOfPrices);
  if (salePrice === -1) {
    priceArray = [];
    totalPrice.innerText = 0;
  } else {
    priceArray.push(salePrice);
    const priceSum = priceArray.reduce((acc, crr) => acc + crr, 0);
    // priceSum = +priceSum.toFixed(2);
    totalPrice.innerText = `${priceSum}`;
  }
}

// ------------------------------------------------------------------------------

function storeCart() {
  localStorage.setItem('shoppingCart', document.querySelector(`${cartItems}`).innerHTML);
}

function storePrices() {
  const prices = document.querySelector(`${sumOfPrices}`).innerHTML;
  localStorage.setItem('totalPriceCart', prices);
}
// ------------------------------------------------------------------------------

function clearCart() {
  const clearButton = document.querySelector('.empty-cart');
  const olCart = document.querySelector(`${cartItems}`);
  clearButton.addEventListener('click', () => {
    while (olCart.firstChild) {
      olCart.removeChild(olCart.firstChild);
    }
    storeCart();
    getTotalPrice({ salePrice: -1 });
    storePrices();
  });
}
// ------------------------------------------------------------------------------

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  const img = image.replace(/-I.jpg/g, '-O.jpg');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(img));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

// ------------------------------------------------------------------------------

function fetchProducts(url) {
  if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
    const itemsList = document.querySelector('.items');
    const fetchP = fetch(url)
      .then((response) => {
        document.querySelector('.loading').remove();
        return response.json();
      })
      .then((array) => array.results.forEach((item) => itemsList
      .appendChild(createProductItemElement(item))));
    return fetchP;
  }
  throw new Error('endpoint não existe');
}

// ------------------------------------------------------------------------------

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

// ------------------------------------------------------------------------------

function cartItemClickListener(event) {
  event.target.remove();
  const priceToBeRemoved = Number(event.target.innerText.split('$')[1]);
  if (priceToBeRemoved > 0) {
    getTotalPrice({ salePrice: -priceToBeRemoved });
  }
  storeCart();
  storePrices();
}
// ------------------------------------------------------------------------------

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

// ------------------------------------------------------------------------------

function fetchAddToCart(id) {
  fetch(`https://api.mercadolibre.com/items/${id}`)
    .then((response) => response.json())
    .then((object) => {
      const newObj = { 
        sku: object.id, 
        name: object.title, 
        salePrice: object.price, 
      };
      const olCartItems = document.querySelector(`${cartItems}`);
      olCartItems.appendChild(createCartItemElement(newObj));
      storeCart();
      getTotalPrice(newObj);
      storePrices();
    });
}

function addEventAddToCart() {
  document.addEventListener('click', (event) => {
    if (event.target.classList.contains('item__add')) {
      const targetId = event.target.parentNode.firstElementChild.innerText;
      return fetchAddToCart(targetId);
    }
  });
}

// ------------------------------------------------------------------------------

function getStoredCart() {
  const storedCart = localStorage.getItem('shoppingCart');
  document.querySelector(`${cartItems}`).innerHTML = storedCart;
  document.querySelectorAll('.cart__item').forEach((item) => 
  item.addEventListener('click', cartItemClickListener));
}

function getStoredPrice() {
  const storedPrice = localStorage.getItem('totalPriceCart');
  const numberStoredPrice = Number(storedPrice);
  getTotalPrice({ salePrice: numberStoredPrice });
}

// ------------------------------------------------------------------------------

window.onload = function onload() { 
  fetchProducts('https://api.mercadolibre.com/sites/MLB/search?q=computador');
  addEventAddToCart();
  getStoredCart();
  getStoredPrice();
  clearCart();
};