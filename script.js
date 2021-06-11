function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

async function calculatePrice(price, subtract) {
  const totalPriceDiv = document.getElementsByClassName('total-price')[0];
  const totalPrice = Number(totalPriceDiv.innerText);
  if (subtract) {
    totalPriceDiv.innerHTML = totalPrice - price;
  } else {
    totalPriceDiv.innerHTML = totalPrice + price;
  }
}

const fetchItem = async (itemID) => {
  try {
    const itemFetch = await fetch(`https://api.mercadolibre.com/items/${itemID}`);
    const itemJson = await itemFetch.json();
    return itemJson;
  } catch (error) {
    console.log(error);
  }
};

const removeSavedItem = async (itemID) => {
  const cartArray = JSON.parse(localStorage.cart);
  const removed = cartArray.filter((item) => item.id !== itemID);
  localStorage.cart = JSON.stringify(removed);
};

async function cartItemClickListener(event) {
  const itemJson = await fetchItem(event.target.id);
  calculatePrice(itemJson.price, true);
  removeSavedItem(itemJson.id);
  event.target.parentElement.removeChild(event.target);
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function saveToCart(itemObj) {
  // source: https://portfolio.adisazizan.xyz/tutor/push-array-value-in-localstorage
  let cartArray = [];
  if (localStorage.cart) {
    cartArray = JSON.parse(localStorage.cart);
  }
  cartArray.push(itemObj);
  localStorage.cart = JSON.stringify(cartArray);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.classList.add('cart__item');
  li.id = sku;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function appendCartItem(itemObj, fromClick) {
  const cartContainer = document.getElementsByClassName('cart__items')[0];
  const { id: sku, title: name, price: salePrice } = itemObj;
  const cartItem = createCartItemElement({ sku, name, salePrice });
  cartContainer.appendChild(cartItem);
  calculatePrice(salePrice);
  if (fromClick) saveToCart(itemObj);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addItemCart(event) {
  const itemId = getSkuFromProductItem(event.target.parentElement);
  fetch(`https://api.mercadolibre.com/items/${itemId}`)
    .then((res) => res.json())
    .then((elem) => appendCartItem(elem, true));
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  const itemAddBtn = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  itemAddBtn.addEventListener('click', addItemCart);

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(itemAddBtn);

  return section;
}

function appendItems(jsonResults) {
  const itemSection = document.querySelector('.items');
  jsonResults.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    itemSection.appendChild(createProductItemElement({ sku, name, image }));
  });
  itemSection.removeChild(document.getElementById('load-info'));
}

const getItems = async (item) => {
  try {
    const itemsFetch = await fetch(
      `https://api.mercadolibre.com/sites/MLB/search?q=${item}`,
    );
    const itemsJson = await itemsFetch.json();
    appendItems(itemsJson.results);
  } catch (error) {
    console.log(error);
  }
};

function loadSavedCart() {
  const savedCart = JSON.parse(localStorage.cart);
  savedCart.forEach((itemObj) => appendCartItem(itemObj));
}

function clearCart() {
  const totalPriceDiv = document.getElementsByClassName('total-price')[0];
  const cartContainer = document.getElementsByClassName('cart__items')[0];
  cartContainer.innerHTML = '';
  totalPriceDiv.innerHTML = 0;
  localStorage.removeItem('cart');
}

window.onload = function onload() {
  getItems('computador');

  if (localStorage.cart) loadSavedCart();

  document.getElementsByClassName('empty-cart')[0].addEventListener('click', clearCart);
};
