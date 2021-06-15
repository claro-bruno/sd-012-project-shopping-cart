const API_MERCADO_LIVRE = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
const API_PRODUCT_SELECTED = 'https://api.mercadolibre.com/items/';
const ERROR_MESSAGE = 'Error';
const cartItem = document.querySelector('.cart_items');
const listOrdener = 'ol.cart__items';
const productList = 'product-list';
// ------------------------------------------------------------------------------------

function saveListLocalStorage() {
  localStorage.setItem('buyList', cartItem.innerHTML);
  localStorage.setItem('prices', priceTotal.innerHTML);
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

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function fetchListItems() {
  const itemsElements = document.querySelector('.items');
  fetch(`${API_MERCADO_LIVRE}`)
    .then((response) => response.json())
    .then((response) => response.results)
    .then((items) => items.forEach((item) => 
      itemsElements.appendChild(createProductItemElement(item))));
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // código aqui
  event.target.remove();
  saveListLocalStorage();
}

const addItemstoCart = async (event) => {
  const parentNode = event.target.parentNode;
  const productSelected = parentNode.firstChild.innerText;

  try {
    const response = await fetch(`${API_PRODUCT_SELECTED}${productSelected}`);
    const result = await response.json();
    cartItem.appendChild(createCartItemElement(result))
    .addEventListener('click', cartItemClickListener);

    saveListLocalStorage();
  } catch (error) {
    alert (ERROR_MESSAGE);
  }
}

function emptyShoppingCart () {
  const emptyCartButton = document.querySelector('.empty-cart');
  const cartItems = document.querySelector(listOrdener);
  emptyCartButton.addEventListener('click', () => {
    cartItems.innerHTML = '';
    localStorage.clear();
  });
}

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = function onload() {
  fetchListItems();
  // addItemstoCart();
};
