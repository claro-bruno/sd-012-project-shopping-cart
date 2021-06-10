function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function cartItemClickListener(event) {
  event.target.parentElement.removeChild(event.target);
  console.log(event.target);
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
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function appendCartItem(itemObj, fromClick) {
  const cartContainer = document.getElementsByClassName('cart__items')[0];
  const { id: sku, title: name, price: salePrice } = itemObj;
  const cartItem = createCartItemElement({ sku, name, salePrice });
  cartContainer.appendChild(cartItem);
  if (fromClick) saveToCart(itemObj);
}

function addItemCart(event) {
  const itemId = event.target.parentElement.firstChild.innerHTML;
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
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(itemAddBtn);

  return section;
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function appendItem(jsonResults) {
  const itemSection = document.querySelector('.items');
  jsonResults.forEach((item) => {
    const { id: sku, title: name, thumbnail: image } = item;
    itemSection.appendChild(createProductItemElement({ sku, name, image }));
  });
  itemSection.removeChild(document.getElementById('load'));
}

const getItem = async (item) => {
  try {
    await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${item}`)
      .then((res) => res.json())
      .then((json) => {
        appendItem(json.results);
        // resolve();
      });
  } catch (error) {
    console.log(error);
  }
};

function loadSavedCart() {
  const savedCart = JSON.parse(localStorage.cart);
  savedCart.forEach((itemObj) => appendCartItem(itemObj));
}

function clearCart() {
  const cartContainer = document.getElementsByClassName('cart__items')[0];
  cartContainer.innerHTML = '';
  localStorage.cart = '';
}

window.onload = function onload() {
  getItem('computador');

  document.getElementsByClassName('empty-cart')[0].addEventListener('click', clearCart);

  if (localStorage.cart) loadSavedCart();
};
