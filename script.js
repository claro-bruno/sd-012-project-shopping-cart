let totalPrice = 0;
const totalPriceClass = '.total-price';
const localStorageCart = Number(JSON.parse(localStorage.getItem('cart')));
if (localStorageCart) {
  totalPrice = localStorageCart.reduce((accumulator, cartItem) => (
    accumulator + cartItem.salePrice
  ), 0);
}
console.log('line 4', totalPrice);

async function fetchList() {
  try {
    const searchQuery = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
    const fetchResult = await fetch(searchQuery);
    const fetchResultJson = await fetchResult.json();
    const computers = fetchResultJson.results;
    const computersFilteredKeys = computers.map(({ id, title, price, thumbnail }) =>
      ({ sku: id, name: title, price, image: thumbnail }));
    // console.log(computers);
    // console.log(computersFilteredKeys);
    return computersFilteredKeys;
  } catch (error) {
    console.log(error);
  }
}

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

function createProductItemElement({ sku, name, image }) {
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
  const priceNumberElement = document.querySelector(totalPriceClass);
  const itemsElement = event.path[1];
  const itemElement = event.path[0];
  const itemElementArray = itemElement.innerText.split(' ');
  itemsElement.removeChild(itemElement);
  totalPrice -= Number(itemElementArray[itemElementArray.length - 1].split('$')[1]);
  // priceNumberElement.innerText = totalPrice.toFixed(2);
  priceNumberElement.innerText = parseFloat(totalPrice.toFixed(2));
  const itemElementSku = itemElementArray[1];
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  let updatedCartItems;
  if (cartItems) {
    updatedCartItems = cartItems.filter((cartItem) => cartItem.sku !== itemElementSku);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  }
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
function addCartItemToLocalStorage({ sku, name, salePrice }) {
  const priceNumberElement = document.querySelector(totalPriceClass);
  totalPrice += salePrice;
  priceNumberElement.innerText = parseFloat(totalPrice.toFixed(2));
  const cartLocalStorage = JSON.parse(localStorage.getItem('cart')) || [];
  cartLocalStorage.push({ sku, name, salePrice });
  // console.log({ sku, name, salePrice });
  localStorage.setItem('cart', JSON.stringify(cartLocalStorage));
}
function addOnClickEventListener() {
  const items = document.querySelectorAll('.item');
  items.forEach(async (item) => {
    // console.log(item.children[3]);
    // console.log(item.children[0].innerText);
    item.children[3].addEventListener('click', async () => {
      const searchQuery = `https://api.mercadolibre.com/items/${item.children[0].innerText}`;
      const fetchResult = await fetch(searchQuery);
      const { id, title, price } = await fetchResult.json();

      // console.log(id, title, price);
      const cartItemElement = createCartItemElement({ sku: id, name: title, salePrice: price });
      // console.log(createCartItemElement({ sku: id, name: title, salePrice: price }));
      const cartItemsElement = document.querySelector('.cart__items');
      cartItemsElement.appendChild(cartItemElement);
      addCartItemToLocalStorage({ sku: id, name: title, salePrice: price });
    });
  });
}

function getCartFromLocalStorage() {
  const cartItems = JSON.parse(localStorage.getItem('cart'));
  // console.log(cartItems);
  if (cartItems) {
    cartItems.forEach(({ sku, name, salePrice }) => {
      const cartItemElement = createCartItemElement({ sku, name, salePrice });
      const cartItemsElement = document.querySelector('.cart__items');
      cartItemsElement.appendChild(cartItemElement);
    });
  }
  return cartItems;
}

window.onload = async function onload() {
  const priceNumberElement = document.querySelector(totalPriceClass);
  priceNumberElement.innerText = parseFloat(totalPrice.toFixed(2));
  getCartFromLocalStorage();
  // console.log(totalPrice);
  // console.log(itemsElement);
  const computers = await fetchList();
  // console.log(computers); 
  computers.forEach((computer) => {
    const itemsElement = document.querySelector('.items');
    const productSection = createProductItemElement(computer);
    itemsElement.appendChild(productSection);
  });
  addOnClickEventListener();
};