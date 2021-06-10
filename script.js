function verifiedFetch(url) {
  return new Promise((resolve, reject) => {
    if (url === 'https://api.mercadolibre.com/sites/MLB/search?q=computador') {
      fetch(url)
        .then((r) => r.json())
        .then((r) => resolve(r.results));
    } else {
      reject(new Error('endpoint não existe'));
    }
  });
}

function fetchItem(itemId) {
  return new Promise((resolve, reject) => {
    const rootUrl = 'https://api.mercadolibre.com/items/';
    const url = rootUrl + itemId;
    if (url === rootUrl + itemId) {
      fetch(url)
        .then((r) => r.json())
        .then((r) => resolve(r));
    } else {
      reject(new Error('endpoint não existe'));
    }
  });
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
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  );

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const getCartItems = document.querySelector('.cart__items');
  getCartItems.removeChild(event.target);
  const itemSku = event.target.innerText.substring(5, 18);
  localStorage.removeItem(itemSku);
}

function addCartItemToStorage(item) {
  localStorage.setItem(item.sku, JSON.stringify(item));
  console.log(localStorage);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addItem(product, cart) {
  const cartItem = {
    sku: product.id,
    name: product.title,
    salePrice: product.price,
  };
  cart.appendChild(createCartItemElement(cartItem));
  addCartItemToStorage(cartItem);
}

function removeItemFromCart() {
 const cartItems = document.querySelectorAll('.cart__item');
 cartItems.forEach((cartItem) => {
  cartItem.addEventListener('click', cartItemClickListener);
 });
}

function addCartItems(cart) {
  const items = document.querySelectorAll('.item');
  items.forEach((item) => {
    const getButton = item.querySelector('button.item__add');
    const getItemID = getSkuFromProductItem(item);
    getButton.addEventListener('click', () => {
      fetchItem(getItemID).then((product) => addItem(product, cart));
    });
  });
}

function createProductList(products) {
  const getItemsSection = document.querySelector('.items');
  products.forEach((product) => {
    const item = {
      sku: product.id,
      name: product.title,
      image: product.thumbnail,
    };
    getItemsSection.appendChild(createProductItemElement(item));
  });
}

function loadCartFromStorage(cart) {
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    const cartItem = JSON.parse(localStorage.getItem(key));
    cart.appendChild(createCartItemElement(cartItem));
  }
}

window.onload = function onload() {
  const url = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  const cart = document.querySelector('.cart__items');

  loadCartFromStorage(cart);
  verifiedFetch(url)
    .then((products) => createProductList(products))
    .then(() => addCartItems(cart))
    .then(() => removeItemFromCart());
};
